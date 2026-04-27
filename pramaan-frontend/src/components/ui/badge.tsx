import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-widest uppercase",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pramaan-blue text-white shadow shadow-pramaan-blue/10",
        secondary:
          "border-transparent bg-steel-surface text-muted-signal",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-dossier-ink border-security-border bg-white",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-risk-amber/10 text-risk-amber border border-risk-amber/20",
        info: "border-transparent bg-blue-50 text-pramaan-blue border border-pramaan-blue/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
