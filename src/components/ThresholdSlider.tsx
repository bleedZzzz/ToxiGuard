'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateToxicityThreshold } from '@/app/actions/settings'

export function ThresholdSlider({ initialValue }: { initialValue: number }) {
    const [value, setValue] = useState([initialValue * 100])
    const [isLoading, setIsLoading] = useState(false)

    async function handleSave() {
        setIsLoading(true)
        try {
            const result = await updateToxicityThreshold(value[0] / 100)
            if (result.success) {
                toast.success('Threshold updated successfully')
            } else {
                toast.error('Failed to update threshold')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 w-full max-w-md">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Detection Sensitivity</span>
                <span className="text-2xl font-bold text-primary">{value[0]}%</span>
            </div>
            <Slider
                value={value}
                onValueChange={setValue}
                max={100}
                step={5}
                className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>More Strict</span>
                <span>Balanced</span>
                <span>More Lenient</span>
            </div>
            <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full mt-4"
            >
                {isLoading ? 'Saving...' : 'Save Sensitivity'}
            </Button>
        </div>
    )
}
