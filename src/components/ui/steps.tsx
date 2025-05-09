
import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep?: number;
  status?: "complete" | "in-progress" | "upcoming";
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  status?: "complete" | "in-progress" | "upcoming";
  icon?: React.ReactNode;
  // Make these optional since they'll be added by the parent Steps component
  isLastStep?: boolean;
  isFirstStep?: boolean;
  index?: number;
}

export function Steps({
  children,
  currentStep = 0,
  status,
  className,
  ...props
}: StepsProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[];
  const totalSteps = steps.length;

  return (
    <div
      className={cn("flex w-full gap-2", className)}
      {...props}
    >
      {steps.map((step, idx) => {
        let stepStatus: "complete" | "in-progress" | "upcoming" = "upcoming";
        
        if (idx < currentStep) {
          stepStatus = "complete";
        } else if (idx === currentStep) {
          stepStatus = "in-progress";
        }
        
        // Create a properly typed set of props to pass to the cloned element
        const stepProps: Partial<StepProps> = {
          status: step.props.status || stepStatus,
          isLastStep: idx === totalSteps - 1,
          isFirstStep: idx === 0,
          index: idx,
        };
        
        return React.cloneElement(step, {
          key: idx,
          ...stepProps
        });
      })}
    </div>
  );
}

export function Step({
  title,
  description,
  status = "upcoming",
  icon,
  isLastStep,
  isFirstStep,
  index,
  className,
  ...props
}: StepProps) {
  return (
    <div 
      className={cn(
        "flex-1 relative", 
        className
      )} 
      {...props}
    >
      <div className="flex items-center mb-2">
        <div 
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 z-10",
            status === "complete" && "bg-primary border-primary text-primary-foreground",
            status === "in-progress" && "border-primary text-primary",
            status === "upcoming" && "border-muted-foreground text-muted-foreground"
          )}
        >
          {status === "complete" ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            icon || <span className="text-xs">{(index !== undefined ? index : 0) + 1}</span>
          )}
        </div>
        {!isLastStep && (
          <div 
            className={cn(
              "h-[2px] flex-1",
              status === "complete" && "bg-primary",
              status === "upcoming" && "bg-muted-foreground/40"
            )}
          />
        )}
      </div>
      {title && (
        <div 
          className={cn(
            "text-sm font-medium",
            status === "complete" && "text-foreground",
            status === "in-progress" && "text-foreground",
            status === "upcoming" && "text-muted-foreground",
            isLastStep && "text-right",
            isFirstStep && "text-left",
            !isLastStep && !isFirstStep && "text-center"
          )}
        >
          {title}
        </div>
      )}
      {description && (
        <div 
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isLastStep && "text-right",
            isFirstStep && "text-left",
            !isLastStep && !isFirstStep && "text-center"
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
}
