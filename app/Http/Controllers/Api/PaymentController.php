<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Shetabit\Multipay\Invoice;
use Shetabit\Payment\Facade\Payment;
use Shetabit\Multipay\Exceptions\InvalidPaymentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index()
    {
        $packages = Package::where('is_active', true)->get();
        return response()->json($packages);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
        ]);

        $user = auth()->user();
        $package = Package::findOrFail($request->package_id);

        try {
            // Create pending transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'package_id' => $package->id,
                'amount' => $package->price,
                'status' => 'pending',
                'description' => "Purchase package: {$package->name}",
                'ip_address' => $request->ip(),
            ]);

            // Create Invoice
            $invoice = (new Invoice)->amount($package->price);
            $invoice->detail('transaction_id', $transaction->id);

            // Purchase via Zarinpal (using generic 'zarinpal' driver or default)
            // Callback URL should point to frontend callback page or backend API
            // For API: it's better to return the URL to frontend, and frontend redirects.
            // Or redirect directly if this endpoint is called by browser navigation.
            // Here we assume API call, so we get the pay URL.
            
            $callbackUrl = env('APP_URL') . "/payment/callback?transaction_id={$transaction->id}";

            return Payment::callbackUrl($callbackUrl)->purchase($invoice, function ($driver, $transactionId) use ($transaction) {
                $transaction->update(['authority' => $transactionId]);
            })->pay()->toJson(); // Returns { "action": "https://...", ... }

        } catch (\Exception $e) {
            Log::error('Payment Error: ' . $e->getMessage());
            return response()->json(['message' => 'Payment initiation failed', 'error' => $e->getMessage()], 500);
        }
    }

    // Backend Verification API (Frontend calls this after returning from bank)
    // Or this can be the direct HTTP callback. Let's make it an API that frontend calls.
    // Scenario: User pays -> Bank redirects to Frontend /payment/result -> Frontend calls this API to verify.
    public function verify(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'Authority' => 'required',
            'Status' => 'required'
        ]);

        $transaction = Transaction::findOrFail($request->transaction_id);

        if ($transaction->status === 'paid') {
            return response()->json(['message' => 'Transaction already paid', 'receipt' => $transaction->toArray()]);
        }

        if ($request->Status !== 'OK') {
            $transaction->update(['status' => 'failed']);
            return response()->json(['message' => 'Payment failed by user or bank'], 400);
        }

        try {
            $receipt = Payment::amount($transaction->amount)->transactionId($transaction->authority)->verify();

            DB::transaction(function () use ($transaction, $receipt) {
                $transaction->update([
                    'status' => 'paid',
                    'ref_id' => $receipt->getReferenceId(),
                    'paid_at' => now(),
                ]);

                // Update User Subscription using Carbon for date manipulation
                $user = User::lockForUpdate()->find($transaction->user_id);
                $package = $transaction->package;

                $currentExpiresAt = $user->subscription_expires_at ? Carbon::parse($user->subscription_expires_at) : now();
                
                // If expired, start from now. If active, add to current expiry.
                if ($currentExpiresAt->isPast()) {
                    $newExpiresAt = now()->addDays($package->duration_days);
                } else {
                    $newExpiresAt = $currentExpiresAt->addDays($package->duration_days);
                }

                $user->update(['subscription_expires_at' => $newExpiresAt]);
            });

            return response()->json(['message' => 'Payment successful', 'ref_id' => $receipt->getReferenceId()]);

        } catch (InvalidPaymentException $e) {
            $transaction->update(['status' => 'failed', 'description' => $e->getMessage()]);
            return response()->json(['message' => 'Payment verification failed', 'error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            Log::error('Verify Error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error during verification'], 500);
        }
    }
}
