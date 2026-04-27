'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteAccount } from "@/app/actions/account"
import { toast } from "sonner"

export function DeleteAccountButton() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteAccount()
            if (result && !result.success) {
                toast.error(result.error || 'Failed to delete account')
                setLoading(false)
            }
            // If successful, the server action redirects — we won't reach here
        } catch {
            toast.error('An error occurred while deleting your account')
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="lg" className="w-full sm:w-auto">
                    Delete Account & All Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                    <DialogDescription>
                        This action is permanent and cannot be undone. All your data including
                        connected accounts, comments, reports, and settings will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Yes, Delete Everything'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
