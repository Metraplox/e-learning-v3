export interface RefundResponse {
    success: boolean;
    refundId?: string;
    amount: number;
    error?: string;
}