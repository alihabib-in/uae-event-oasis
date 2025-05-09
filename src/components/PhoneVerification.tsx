
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface PhoneVerificationProps {
  phone: string;
  recordId: string;
  tableType: "events" | "bids";
  onVerified: () => void;
}

export default function PhoneVerification({
  phone,
  recordId,
  tableType,
  onVerified,
}: PhoneVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const sendVerificationCode = async () => {
    if (!phone) {
      toast.error("Please enter a phone number first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("verify-phone", {
        body: {
          action: "send",
          phone,
          tableType,
          recordId,
        },
      });

      if (error) throw error;

      toast.success("Verification code sent! Please check your phone.");
      setVerificationSent(true);
    } catch (error: any) {
      toast.error(`Failed to send code: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-phone", {
        body: {
          action: "verify",
          code: verificationCode,
          tableType,
          recordId,
        },
      });

      if (error) throw error;

      if (data.verified) {
        toast.success("Phone number verified successfully!");
        onVerified();
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!verificationSent ? (
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            We need to verify your phone number. Click the button below to
            receive a verification code.
          </p>
          <Button
            onClick={sendVerificationCode}
            disabled={isLoading || !phone}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to your phone
          </p>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setVerificationSent(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={verifyCode}
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
