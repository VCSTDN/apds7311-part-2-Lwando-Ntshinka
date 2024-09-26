class payments {
    constructor(paymentID, customerID, paymentAmount, paymentCurrency, SWIFTNo, paymentStatus)
    {
        this.paymentID = paymentID;
        this.customerID = customerID;
        this.paymentAmount = paymentAmount;
        this.paymentCurrency = paymentCurrency;
        this.SWIFTNo = SWIFTNo;
        this.paymentStatus = "pending";
    }

}