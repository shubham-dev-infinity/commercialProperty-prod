$(document).ready(function () {
    /*$("body").on('input', '#interest_rate, #management_fees_amount,#rent-reviews', function () {
        var inputElement = $(this)[0]; // Get the DOM element

        // Get the current cursor position
        var cursorPosition = inputElement.selectionStart;

        // Get the input value
        var inputValue = $(this).val();

        // Check if the value already ends with '%'
        if (!inputValue.endsWith('%')) {
            // Update the input value with '%' appended
            $(this).val(inputValue + '%');

            // Set the cursor position before the '%'
            inputElement.setSelectionRange(cursorPosition, cursorPosition);
        }
    });*/
    $("body").on('input', '.amountInput', function () {
        var inputElement = this;
        var originalCursorPosition = inputElement.selectionStart;

        // Get the numeric value without non-numeric characters
        var numericValue = parseFloat($(this).val().replace(/[^0-9.-]/g, ''));
        // Check if the numeric value is NaN (not a number)
        if (isNaN(numericValue)) {
            // If NaN, set the input value to an empty string and exit the function
            $(this).val('');
            return;
        }
        // Get the input value before formatting
        var originalInputValue = $(this).val();

        // Format the numeric value with the '$' sign
        var formattedValue = '$' + numericValue.toLocaleString();

        // Check if the numeric value is 0 after deleting the first digit
        if (numericValue === 0 && originalInputValue.indexOf('0') === 1) {
            // Revert to the original input value and keep the cursor position
            $(this).val(originalInputValue);
            inputElement.setSelectionRange(originalCursorPosition, originalCursorPosition);
            return;
        }

        // Calculate the change in length due to formatting
        var lengthDiff = formattedValue.length - originalInputValue.length;

        // Update the input value
        $(this).val(formattedValue);

        // Calculate the new cursor position
        var newCursorPosition = originalCursorPosition + lengthDiff;

        // Set the cursor position after updating the input
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);


        updateDiscount();
        totalCashRequired();
        loanEstablishedExpense();
        updateTotalNetRent();
        annualPropertyExpenses();
        // calculatePMT();
        loanExpenses();
        var card = $(this).closest('.card')[0];
        if (card) {
            updateGrossRent(card);
            calculateLeaseLeft(card);
        }

        // } else {
        //     $(this).val('');
        // }
    });
    function updateDiscount() {
        var marketValue = parseFloat($('#market-value').val().replace(/[^0-9.-]/g, '')) || 0;
        var purchasePrice = parseFloat($('#purchase-price').val().replace(/[^0-9.-]/g, '')) || 0;
        $('#widget-purchase-price').text('$' + purchasePrice.toLocaleString());
        if (marketValue > purchasePrice) {
            var discountAmount = marketValue - purchasePrice;
            var discountPercentage = marketValue !== 0 ? (discountAmount / marketValue) * 100 : 0;
            discountPercentage = (discountPercentage * 100) / 100;
            $('#discount-percent').text(discountPercentage.toFixed(2) + '%');
            discountAmount = (discountAmount * 100) / 100;
            $('#discount-price').text('$' + discountAmount.toLocaleString());
            $('.discount').show();
            $('.overprice').hide();
            $('#result-message').hide();
        } else if (marketValue < purchasePrice) {
            var overpricedAmount = purchasePrice - marketValue;
            var overpricedPercentage = marketValue !== 0 ? (overpricedAmount / marketValue) * 100 : 0;
            overpricedPercentage = (overpricedPercentage * 100) / 100;
            $('#overpriced-percent').text(overpricedPercentage.toFixed(2) + '%');
            overpricedAmount = (overpricedAmount * 100) / 100;
            $('#overpriced-price').text('$' + overpricedAmount.toLocaleString());
            $('.overprice').show();
            $('.discount').hide();
            $('#result-message').hide();
        }
        else {
            $('#result-message').show();
            $('#result-message').text("Purchasing at Market Price");
            $('.overprice').hide();
            $('.discount').hide();
        }
    }
    var totalCash = 0;
    function totalCashRequired() {
        var downpayment = parseFloat($('#down-payment').val().replace(/[^0-9.-]/g, '')) || 0;
        var propertyImprovement = parseFloat($('#property-improvements').val().replace(/[^0-9.-]/g, '')) || 0;
        var legals = parseFloat($('#legals').val().replace(/[^0-9.-]/g, '')) || 0;
        var stampDutyCalculators = parseFloat($('#stamp-duty-calculator').val().replace(/[^0-9.-]/g, '')) || 0;
        var otherCosts = parseFloat($('#other-costs').val().replace(/[^0-9.-]/g, '')) || 0;
        var buyerAgentFees = parseFloat($('#buyer-agent-fees').val().replace(/[^0-9.-]/g, '')) || 0;
        var totalCashRequired = downpayment + propertyImprovement + legals + stampDutyCalculators + otherCosts + buyerAgentFees;
        totalCash = totalCashRequired;

        $('#total-cash-required').text('$' + totalCashRequired.toLocaleString());
        $('#widget-cash-required').text('$' + totalCashRequired.toLocaleString());
        loanEstablishedExpense();
        loanExpenses();
    }
    var totalPurchasePrice = 0;
    var totalExpensesAmount = 0;
    function loanEstablishedExpense() {
        var loanEstablishedFees = parseFloat($('#loan-establishment-fee').val().replace(/[^0-9.-]/g, '')) || 0;
        var propertyValuation = parseFloat($('#property-valuation').val().replace(/[^0-9.-]/g, '')) || 0;
        var lenderMortgageInsurance = parseFloat($('#lender-mortgage-insurance').val().replace(/[^0-9.-]/g, '')) || 0;
        var otherLoanCosts = parseFloat($('#other-loan-costs').val().replace(/[^0-9.-]/g, '')) || 0;
        totalExpensesAmount = loanEstablishedFees + propertyValuation + lenderMortgageInsurance + otherLoanCosts;
        $('#total-expenses-amount').text('$' + totalExpensesAmount.toLocaleString());
        var purchasePrice = parseFloat($('#purchase-price').val().replace(/[^0-9.-]/g, '')) || 0;
        var propertyImprovement = parseFloat($('#property-improvements').val().replace(/[^0-9.-]/g, '')) || 0;
        var legals = parseFloat($('#legals').val().replace(/[^0-9.-]/g, '')) || 0;
        var stampDutyCalculators = parseFloat($('#stamp-duty-calculator').val().replace(/[^0-9.-]/g, '')) || 0;
        var otherCosts = parseFloat($('#other-costs').val().replace(/[^0-9.-]/g, '')) || 0;
        var buyerAgentFees = parseFloat($('#buyer-agent-fees').val().replace(/[^0-9.-]/g, '')) || 0;
        var total = purchasePrice + propertyImprovement + legals + stampDutyCalculators + otherCosts + buyerAgentFees;
        totalPurchasePrice = totalExpensesAmount + total;
        $('#total-purchasePrice').text('$' + totalPurchasePrice.toLocaleString());
        loanExpenses();
    }
    function annualPropertyExpenses() {
        var rate_amount = parseFloat($('#rate_amount').val().replace(/[^0-9.-]/g, '')) || 0;
        var building_insurance_amount = parseFloat($('#building_insurance_amount').val().replace(/[^0-9.-]/g, '')) || 0;
        var landlord_insurance_amount = parseFloat($('#landlord_insurance_amount').val().replace(/[^0-9.-]/g, '')) || 0;
        var strata_fees_amount = parseFloat($('#strata_fees_amount').val().replace(/[^0-9.-]/g, '')) || 0;
        var land_tax_amount = parseFloat($('#land_tax_amount').val().replace(/[^0-9.-]/g, '')) || 0;
        var maintenance_amount = parseFloat($('#maintenance_amount').val().replace(/[^0-9.-]/g, '')) || 0;

        // var floorArea = document.querySelector('#total_floor_area');
        // var totalFloorArea = parseFloat(floorArea.textContent.replace(/[^0-9.-]/g, '')) || 0;
        var collected_outgoing = document.querySelector('#total_collected_outgoing');
        var total_collected_outgoing = parseFloat(collected_outgoing.textContent.replace(/[^0-9.-]/g, ''));
        var management_fees_rate = parseFloat($('#management_fees_amount').val()) || 0;

        var amount = management_fees_rate * (total_net_income + total_collected_outgoing) / 100;
        console.log("amount :-", amount);
        if (isNaN(amount)) {
            $('#management_fees').text('$0');
        } else {
            $('#management_fees').text('$' + Math.round(amount).toLocaleString());
        }

        // $('#management_fees').text('$' + Math.round((weeklyRent * propertyfeesRate * 52) / 100).toLocaleString());

        var total = rate_amount + building_insurance_amount + landlord_insurance_amount + strata_fees_amount +
            land_tax_amount + maintenance_amount + amount;
        if (isNaN(total)) {
            $('#total-amount').text('$0');
        } else {
            $('#total-amount').text('$' + Math.round(total).toLocaleString());
        }

    }
    var pi_amount = 0;
    var io_amount = 0;
    function loanExpenses() {
        var purchasePrice = parseFloat($('#purchase-price').val().replace(/[^0-9.-]/g, '')) || 0;
        var downpayment = parseFloat($('#down-payment').val().replace(/[^0-9.-]/g, '')) || 0;
        // var totalExpensesAmount = document.querySelector('#total-expenses-amount');
        // var loanTotalExpense = parseFloat(totalExpensesAmount.textContent.replace('$', '').replace(',', ''));
        var loanTotalExpense = totalExpensesAmount;
        // console.log('totalExpensesAmount :',totalExpensesAmount);
        // console.log('loanTotalExpense :',loanTotalExpense);

        var totalFundBorrowed = purchasePrice - downpayment + loanTotalExpense;
        $('#fund-borrowed-amount').text('$' + totalFundBorrowed.toLocaleString());
        var interestRate = parseFloat($('#interest_rate').val().replace(/[^0-9.-]/g, '')) || 0;
        var loan_term = parseFloat($('#loan-term').val().replace(/[^0-9.-]/g, '')) || 0;
        // console.log("loanTerm :",loan_term);
        // var loanTerm = 30;
        var monthlyRepayments = calculatePMT(interestRate, loan_term, totalFundBorrowed);
        $('#monthly-repayment-amount').text('$' + Math.round(monthlyRepayments).toLocaleString());
        var annualRepayments = monthlyRepayments * 12;
        $('#annual-repayment-amount').text('$' + Math.round(annualRepayments).toLocaleString());
        var annualInterest = totalFundBorrowed * interestRate * 0.01;
        $('#interest_annual_repayment_amount').text('$' + annualInterest.toLocaleString());
        var lvr = (totalFundBorrowed / purchasePrice) * 100;
        if (isNaN(lvr)) {
            $('#lvr_amount').text('0%');
        } else {
            $('#lvr_amount').text(lvr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
        var totalRepaymentAmount = document.querySelector('#total-amount');
        var annualRepaymentExpenses = parseFloat(totalRepaymentAmount.textContent.replace(/[^0-9.-]/g, ''));

        var recoverable_amount = document.querySelector('#total_collected_outgoing');
        var recoverable_outgoing = parseFloat(recoverable_amount.textContent.replace(/[^0-9.-]/g, '')) || 0;
        if (isNaN(recoverable_outgoing)) {
            $('#recoverable_amount').text('$0');
        } else {
            $('#recoverable_amount').text('$' + Math.round(recoverable_outgoing).toLocaleString());
        }

        //pi  
        pi_amount = annualRepayments + annualRepaymentExpenses - recoverable_outgoing;
        if (isNaN(pi_amount)) {
            $('#principle-interest-amount').text('$0');
        } else {
            $('#principle-interest-amount').text('$' + Math.round(pi_amount).toLocaleString());
        }
        //io
        io_amount = annualInterest + annualRepaymentExpenses - recoverable_outgoing;
        if (isNaN(io_amount)) {
            $('#interest-only-amount').text('$0');

            $('#widget-value-add').text('$0');
        } else {
            $('#interest-only-amount').text('$' + Math.round(io_amount).toLocaleString());
            $('#widget-value-add').text('$' + Math.round(io_amount).toLocaleString());
        }
    }

    function calculatePMT(annualRate, loanTerm, principal) {
        var monthlyRate = annualRate / 12 / 100;
        console.log('monthly rate:', monthlyRate);
        var numberOfPayments = loanTerm * 12;
        var pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        if (!isNaN(parseFloat(pmt)) && isFinite(pmt)) {
            console.log('pmt:', pmt);
            return pmt;
        } else {
            console.log('Invalid result for PMT calculation');
            return '0';
        }
    }


    let cardCounter = 1;
    let lastAddedCard = null;
    let eventListenerAttached = false;

    // Attach the click event listener to a common ancestor
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('addTenancyCard')) {
            event.stopPropagation();
            addTenancyCard(event.target);
        }
    });

    function addTenancyCard(clickedButton) {
        var originalCard = document.querySelector('.property-income .card.renovation-cost');

        console.log("buttonClicked");
        cardCounter++;

        // Create a new card element
        var newCard = document.createElement('div');
        newCard.className = 'card renovation-cost mt-4';

        // Add card header and body content
        newCard.innerHTML = `
        <div class="property_box renovation-cost">
        <h2>TENANT</h2>
    <div class="card-body property_price">
    <form>
    <fieldset class="annual-property-expense" style="border-bottom: unset;">
        <div class="d-flex justify-content-between align-items-center mb-3 ">
            <h6 class="tenant-heading">TENANT ${cardCounter}</h6>
            <button class="button remove-card-btn"> <div class="circle-icon">
                <i class="fas fa-times"></i>
            </div>
            Remove</button>
        </div>
      
        <div class="form-group property_input">
            <label class="purchase_label" for="internal_painting"> Tenant Name </label>
            <input class="property_inner_input" type="text"  id="tenant-name${cardCounter}" placeholder="Name of Tenant 1" style="
            width: 255px;"/>
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="external_painting">Tenant Use</label>
            <input class="property_inner_input" type="text"  id="tenant-use${cardCounter}" placeholder="Tenant ${cardCounter}’s Business"style="
            width: 255px;" />
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="flooring">Annual Net Rent</label>
            <input type="text" class="amountInput property_inner_input net-rent" id="net-rent${cardCounter}" placeholder="" />
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="flooring">Annual Outgoings</label>
            <input type="text" class="amountInput property_inner_input annual-outgoings" id="annual-outgoings${cardCounter}" placeholder="" />
        </div>
        <div class="form-group property_input">
            <label class="annual-repayment">Annual Gross Rent</label>
            <label class="annual-repayment-amount gross-rent" id="annual-gross-rent${cardCounter}">$0</label>
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="lease-expiry">Lease Expiry</label>
            <input type="date" id="lease-expiry${cardCounter}" placeholder="" class="date-input lease-expiry property_inner_input" style="width:160px" value="" min="1997-01-01" max="2040-12-31">
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="roof">Lease Left (years)</label>
            <input type="text"  id="lease-left${cardCounter}" class="lease-left property_inner_input" placeholder="" />
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="roof">Options</label>
            <input type="text"  id="options${cardCounter}" class="options property_inner_input" placeholder="" />
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="roof">Rent Reviews</label>
            <input type="text"  id="rent-reviews${cardCounter}" class="rent-reviews property_inner_input" placeholder="0%" />
        </div>
        <div class="form-group property_input">
            <label class="purchase_label" for="roof">Occupied Area (sqm)</label>
            <input type="text"  id="occupied-area${cardCounter}" class="occupied-area property_inner_input" placeholder="" />
        </div>
    </fieldset>
    <button type="button" class="btn add_tenantBtn tenant addTenancyCard"><i class="fa-solid fa-plus plus-icon"></i>ADD A TENANCY</button>
<div>
</form>
        </div>
    </div>
`;



        $(clickedButton).closest('.card').after(newCard);

        lastAddedCard = newCard;
        updateGrossRent(newCard);
        calculateNumberOfCards();
        tenancy_summary();
        annualRepaymentAmount();
    }

    if (!eventListenerAttached) {
        console.log("Attaching event listener");
        document.addEventListener('click', function (event) {
            if (event.target.classList.contains('addTenancyCard')) {
                event.stopPropagation();
                addTenancyCard(event.target);
            }
        });

        eventListenerAttached = true;
    } else {
        console.log("Event listener already attached");
    }

    function updateGrossRent(card) {
        let netRentField = card.querySelector('.amountInput.net-rent');
        let annualOutgoingsField = card.querySelector('.amountInput.annual-outgoings');
        let grossRentLabel = card.querySelector('.annual-repayment-amount.gross-rent');
        console.log('netRentField:', netRentField);
        console.log('annualOutgoingsField:', annualOutgoingsField);
        console.log('grossRentLabel:', grossRentLabel);
        // Check if all required elements are present before proceeding
        if (netRentField && annualOutgoingsField && grossRentLabel) {
            let netRent = parseFloat(netRentField.value.replace(/[^0-9.-]/g, '')) || 0;
            let annualOutgoings = parseFloat(annualOutgoingsField.value.replace(/[^0-9.-]/g, '')) || 0;

            let grossRent = netRent + annualOutgoings;
            grossRentLabel.textContent = '$' + grossRent.toFixed(2);
        } else {
            console.error("Some required elements not found.");
        }
    }
    function calculateNumberOfCards() {
        // Select all elements with the class 'card'
        var cards = document.querySelectorAll('.renovation-cost');
        var removeButtons = document.querySelectorAll('.remove-card-btn');
        // Get the length of the NodeList, which represents the number of cards
        var numberOfCards = cards.length;
        if (cards.length == 1) {
            removeButtons[0].style.display = 'none'
        }
        else {
            for (var i = 0; i < removeButtons.length; i++) {
                removeButtons[i].style.display = 'block';
            }

        }

        // Log or use the calculated number of cards as needed tenancies_count
        console.log('Number of cards:', numberOfCards);
        $('#tenancies_count').text(Math.round(numberOfCards).toLocaleString());
    }

    function updateTotalNetRent() {
        let netRentFields = document.querySelectorAll('.amountInput.net-rent');
        let totalNetRent = 0;

        netRentFields.forEach((field) => {
            let netRentValue = parseFloat(field.value.replace(/[^0-9.-]/g, '')) || 0;
            totalNetRent += netRentValue;
            console.log("Total Net Rent" + totalNetRent);
        });

        // Update the total net rent wherever you want to display it total_net_income
        $('#total_net_income').text('$' + Math.round(totalNetRent).toLocaleString());
        console.log('Total Net Rent:', totalNetRent);

    }
    function totalCollectedOutgoings() {
        let outgoingFields = document.querySelectorAll('.amountInput.annual-outgoings');
        let totalOutgoings = 0;

        outgoingFields.forEach((field) => {
            let outgoing = parseFloat(field.value.replace(/[^0-9.-]/g, '')) || 0;
            totalOutgoings += outgoing;
            console.log("Total Net Rent" + totalOutgoings);
        });

        // Update the total net rent wherever you want to display it total_net_income
        $('#total_collected_outgoing').text('$' + Math.round(totalOutgoings).toLocaleString());
        console.log('Total OutGoings:', totalOutgoings);

    }

    function calculateYearFractionFromDate(date) {
        // Get the current date
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Parse the selected date from the input
        var selectedDate = new Date(date.value);
        selectedDate.setHours(0, 0, 0, 0);

        // Check if the parsing was successful
        if (isNaN(selectedDate.getTime())) {
            console.log('Invalid date format');
            return 0;
        }

        // Calculate the difference in days using the 30/360 day count convention
        var dayDiff = 360 * (currentDate.getFullYear() - selectedDate.getFullYear()) +
            30 * (currentDate.getMonth() - selectedDate.getMonth()) +
            (currentDate.getDate() - selectedDate.getDate());

        // Calculate the year fraction with a basis of 1 (30/360)
        var yearFraction = Math.abs(dayDiff / 360);

        return yearFraction;
    }

    function calculateLeaseLeft(card) {
        // Get the expiry date input element
        var expiry_date = card.querySelector('.date-input');

        // Call the calculateYearFractionFromDate function and log the result
        var yearFraction = calculateYearFractionFromDate(expiry_date);
        console.log('Year Fraction:', yearFraction);

        // Use the yearFraction value as needed
        // For example, you can update the lease-left input field with the calculated value:
        var leaseLeftInput = card.querySelector('.lease-left');
        leaseLeftInput.value = yearFraction.toFixed(2);
    }
    // occupied-area2

    function calculateTotalArea() {
        let areaFields = document.querySelectorAll('.occupied-area');
        let totalArea = 0;

        areaFields.forEach((field) => {
            let area = parseFloat(field.value) || 0;
            totalArea += area;
            console.log("Total Net Rent" + totalArea);
        });

        // Update the total net rent wherever you want to display it total_net_income
        $('#total_floor_area').text(Math.round(totalArea).toLocaleString());
        console.log('Total OutGoings:', totalArea);

    }
    var totalWale = 0;
    function calculate_wale(card) {
        var leaseLeft = parseFloat(card.querySelector('.lease-left').value) || 0;
        var occupiedArea = parseFloat(card.querySelector('.occupied-area').value) || 0;

        var floorArea = document.querySelector('#total_floor_area');
        var totalFloorArea = parseFloat(floorArea.textContent.replace(/[^0-9.-]/g, '')) || 0;

        if (isNaN(totalFloorArea)) {
            console.error('Invalid input. Please enter valid numbers.');
            return 0;
        }

        var wale = (leaseLeft * occupiedArea) / totalFloorArea;
        console.log("Wale" + wale);
        // totalWale+= wale;
        return wale;
    }
    console.log(totalWale);


    function calculateTotalWale() {
        var cards = document.querySelectorAll('.renovation-cost');
        var totalWale = 0;
        cards.forEach(function (card) {
            var wale = calculate_wale(card);
            console.log("loopwale:" + wale)
            // Check if wale is NaN
            if (!isNaN(wale)) {
                totalWale += wale;
                console.log("Total Wale" + totalWale)
            } else {
                console.error('Invalid input. Please enter valid numbers.');
            }
        });

        // Update the totalWale only if it's not NaN
        if (!isNaN(totalWale)) {
            $('#w_a_l_e').text(totalWale.toLocaleString());
            $('#widget-equity-io').text(totalWale.toLocaleString());
            console.log('Total WALE:', totalWale);
        }
    }

    var total_net_income = 0;
    var total_collected_outgoing = 0;
    function tenancy_summary() {
        // var floorArea = document.querySelector('#total_floor_area');
        // var totalFloorArea = parseFloat(floorArea.textContent.replace(/[^0-9.-]/g, '')) || 0;
        var tenancy_count = document.querySelector('#tenancies_count');
        var total_tenancy = parseFloat(tenancy_count.textContent.replace(/[^0-9.-]/g, ''));
        // console.log("total_tenancy:",total_tenancy);
        var net_income = document.querySelector('#total_net_income');
        total_net_income = parseFloat(net_income.textContent.replace(/[^0-9.-]/g, ''));
        // console.log("total_net_income",total_net_income);
        var collected_outgoing = document.querySelector('#total_collected_outgoing');
        total_collected_outgoing = parseFloat(collected_outgoing.textContent.replace(/[^0-9.-]/g, ''));
        // console.log("total_net_income",total_collected_outgoing);
        var floor_area = document.querySelector('#total_floor_area');
        var total_floor_area = parseFloat(floor_area.textContent.replace(/[^0-9.-]/g, ''));
        // console.log("total_net_income",total_floor_area);
        var wale = document.querySelector('#w_a_l_e');
        var w_a_l_e = parseFloat(wale.textContent.replace(/[^0-9.-]/g, ''));

        // console.log("total_net_income",w_a_l_e);
        //$('#widget-equity-io').text(w_a_l_e.toLocaleString());
    }

    async function annualRepaymentAmount() {
        console.log("IO" + pi_amount);
        console.log("Po" + io_amount);
        console.log("total_net_income" + total_net_income);
        var total_net_income_element = document.querySelector('#total_net_income');
        var total_net_income1 = parseFloat(total_net_income_element.textContent.replace(/[^0-9.-]/g, ''));
        await new Promise(resolve => setTimeout(resolve, 500));
        // var pi_amount_element = document.querySelector('#principle-interest-amount');
        // var pi_amount1 = parseFloat(pi_amount_element.textContent.replace(/[^0-9.-]/g, ''));
        var pi_amount1 = pi_amount;
        var piAmount = total_net_income1 - pi_amount1;
        console.log("Pi" + piAmount);

        $('#asPurchased-p-i-amount').text('$' + Math.round(piAmount).toLocaleString());
        $('#widget-renovation-cost').text('$' + Math.round(piAmount).toLocaleString());
        console.log("piAmount: " + piAmount);

        // Assuming io_amount is a global variable or defined elsewhere
        var ioAmount = total_net_income1 - io_amount;
        $('#asPurchased-ioAmount').text('$' + Math.round(ioAmount).toLocaleString());
        console.log("ioAmount: " + ioAmount);

        var grossYield = (total_net_income / totalPurchasePrice) * 100;
        console.log("grossYield - ", grossYield);
        if (isNaN(grossYield)) {
            $('#asPurchased-grossYield').text('0%');
            $('#widget-value-add').text('0%');
        } else {
            $('#asPurchased-grossYield').text(grossYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#widget-value-add').text(grossYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');

        }

        // ------cash on cash yield(p&i)------- //

        var total_cash_required = document.querySelector('#total-cash-required');
        var totalCash = parseFloat(total_cash_required.textContent.replace(/[^0-9.-]/g, ''));
        var cashYield_pi = (piAmount / totalCash) * 100;

        if (isNaN(cashYield_pi)) {
            $('#asPurchased-cashYield-pi').text('0%');
        } else {
            $('#asPurchased-cashYield-pi').text(cashYield_pi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
        console.log("cashYield_pi:" + cashYield_pi);

        // //------- cash on cash yield(i/0)--------//
        var cashYield_io = (ioAmount / totalCash) * 100;
        if (isNaN(cashYield_io)) {
            $('#asPurchased-cashYield-io').text('0%');
        } else {
            $('#asPurchased-cashYield-io').text(cashYield_io.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
        console.log("cashYield_io:" + cashYield_io);
        // //------- Return on equity--------//
        // //------- Growth Rate@5%--------//
        var purchasePrice = parseFloat($('#purchase-price').val().replace(/[^0-9.-]/g, '')) || 0;

        var growthRate = (ioAmount + 0.05 * purchasePrice) / totalCash * 100;
        console.log("Growth Rate" + growthRate);
        var growthRate = ((ioAmount + (0.05 * purchasePrice)) / totalCash) * 100;
        console.log("Growth Rate2" + growthRate);
        if (isNaN(growthRate)) {
            $('#growthRate_5').text('0%');
            $('#widget-rental-increase').text('0%');
        } else {
            $('#growthRate_5').text(growthRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
            $('#widget-rental-increase').text(growthRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');

        }
        // ------- Growth Rate@7%--------//

        var growthRate_7 = (ioAmount + 0.07 * purchasePrice) / totalCash * 100;

        if (isNaN(growthRate_7)) {
            $('#growthRate_7').text('0%');
        } else {
            $('#growthRate_7').text(growthRate_7.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }

        // //------- Growth Rate@10%--------//

        var growthRate_10 = (ioAmount + 0.1 * purchasePrice) / totalCash * 100;

        if (isNaN(growthRate_10)) {
            $('#growthRate_10').text('0%');
        } else {
            $('#growthRate_10').text(growthRate_10.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%');
        }
    }


    $('#purchase-price').on('input', function () {

        updateDiscount();
        loanEstablishedExpense();

    });
    $('#down-payment').on('input', function () {

        totalCashRequired();

    });
    $('#property-improvements').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();

    });
    $('#property-valuation').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();
        loanExpenses();
        annualRepaymentAmount();

    });
    $('#loan-establishment-fee').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();
        loanExpenses();
        annualRepaymentAmount();

    });
    $('#lender-mortgage-insurance').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();
        loanExpenses();
        annualRepaymentAmount();

    });
    $('#other-loan-costs').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();
        loanExpenses();
        annualRepaymentAmount();

    });
    $('#legals').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();
        loanExpenses();

    });
    $('#stamp-duty-calculator').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();

    });
    $('#buyer-agent-fees').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();

    });
    $('#other-costs').on('input', function () {

        totalCashRequired();
        loanEstablishedExpense();

    });
    $('#lender-mortgage-insurance').on('input', function () {

        loanExpenses();
        totalCashRequired();

    });

    $('#loan-term').on('input', function () {
        loanExpenses();
        annualRepaymentAmount();
    });
    $('#interest_rate').on('input', function () {
        loanExpenses();
        annualRepaymentAmount();
    });
    $('#rate_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#building_insurance_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#landlord_insurance_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#strata_fees_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#land_tax_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#maintenance_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });
    $('#management_fees_amount').on('input', function () {
        annualPropertyExpenses();
        annualRepaymentAmount();
        loanExpenses();
    });



    $('.property-income').on('input', '.amountInput.net-rent', function () {
        updateTotalNetRent();
        tenancy_summary();
        annualRepaymentAmount();
        var card = $(this).closest('.card')[0];
        if (card) {
            updateGrossRent(card);
            calculateLeaseLeft(card);
            // annualRepaymentAmount();
            // updateTotalNetRent();

        }
    });

    $('.property-income').on('input', '.lease-expiry', function () {
        updateTotalNetRent();

        var card = $(this).closest('.card')[0];
        if (card) {
            calculateLeaseLeft(card);
            updateGrossRent(card);
            calculateTotalWale();
            tenancy_summary();
        }
    });

    $('.property-income').on('input', '.amountInput.annual-outgoings', function () {
        updateTotalNetRent();
        tenancy_summary();
        annualRepaymentAmount();
        annualPropertyExpenses();
        loanExpenses();
        var card = $(this).closest('.card')[0];

        if (card) {
            totalCollectedOutgoings();
            calculateLeaseLeft(card);
            updateGrossRent(card);
            // annualRepaymentAmount();
        }
    });

    $('.property-income').on('input', '.occupied-area', function () {
        updateTotalNetRent();
        tenancy_summary();
        var card = $(this).closest('.card')[0];
        if (card) {
            calculateTotalArea();
            totalCollectedOutgoings();
            calculateLeaseLeft(card);
            updateGrossRent(card);
            calculate_wale(card);
            calculateTotalWale();

        }
    });

    $(document).on('click', '.remove-card-btn', function () {
        // Find the parent card and remove it
        var removedCard = $(this).closest('.card');
        removedCard.remove();
        cardCounter--;
        $('.property-income .tenant-heading').each(function (index) {
            $(this).text(`TENANT ${index + 1}`);
        });

        // Find the new last added card
        lastAddedCard = document.querySelector('.col-md-4.property-income .card.renovation-cost:last-child');

        // Resetting variables
        eventListenerAttached = false;

        // Call any additional functions or update logic as needed
        updateTotalNetRent();
        totalCollectedOutgoings();
        calculateNumberOfCards();
        calculateTotalArea();
        calculateTotalWale();
        tenancy_summary();
        annualRepaymentAmount();
        annualPropertyExpenses();
        loanExpenses();
    });

    $(document).on('click', '.addTenancyCard', function () {
        addTenancyCard();
        calculateNumberOfCards();
        tenancy_summary();
        annualRepaymentAmount();

    });

    updateDiscount();
    totalCashRequired();
    loanExpenses();
    annualPropertyExpenses();
    annualRepaymentAmount();
    updateTotalNetRent();
    calculateNumberOfCards();
    calculateTotalWale();
    tenancy_summary();
    // addTenancyCard();

});