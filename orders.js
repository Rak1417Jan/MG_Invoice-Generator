
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDHjq-h24a4RclTZFXs6fUAIrk78baUD3Q",
    authDomain: "mgdigitalpressjobcard.firebaseapp.com",
    projectId: "mgdigitalpressjobcard",
    storageBucket: "mgdigitalpressjobcard.appspot.com",
    messagingSenderId: "886245038190",
    appId: "1:886245038190:web:ad511ad2f7c9c685c3ae7f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;
    const backButton = document.getElementById('backButton');
    const orderDatePicker = document.getElementById('orderDatePicker');
    const orderStatusDropdown = document.getElementById('orderStatusDropdown');
    const orderListTitle = document.getElementById('orderListTitle');
    const ordersContainer = document.querySelector('.orders-container');
    
    let showCompleted = false;

    // Set the default date to today's date
    const today = new Date().toISOString().split('T')[0];
    orderDatePicker.value = today;

    // Back to Parties Page
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Handle dropdown change event
    orderStatusDropdown.addEventListener('change', () => {
        showCompleted = orderStatusDropdown.value === 'completed';
        orderListTitle.textContent = showCompleted ? 'Completed Orders' : 'Pending Orders';
        fetchOrders();
    });

    function generatePDF(data) {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        
        // Table content
        const tableColumns = ["S.NO.", "PAPER DETAILS", "GSM", "PRINT","SHEET", "RATE", "AMOUNT"];
        const tableRows = [];
        var TotalAmount =0;
        var GSTAmount=0;
        var GrandTotal=0;
        // Populate table rows
        if (Array.isArray(data.items)) {
            data.items.forEach((item, index) => {
                var amountPrint=0;
                var amountLamination=0;
                var amountHSCut=0;
                var amountCutting=0;
                var amountBinding=0;
                let laminationSideNum = 1;
                if (String(item.laminationSides[0]) === 'D') {
                    laminationSideNum = 2;
                }        
                amountPrint=item.sheet*item.Printrate;
                amountLamination=laminationSideNum*item.laminationRate*item.laminationsheet;
                amountHSCut=item.cutSheet*item.halfCutShapeCutRate;
                amountCutting=item.cuttingRate*item.normalCuttingSheet;
                amountBinding=item.bindingRate*item.bindingSheet;
                var amountTotal = amountPrint+amountLamination+amountHSCut+amountCutting+amountBinding;
                // console.log(item.)
                const row1 = [
                    `Item ${index + 1}`,
                    `${item.papertype || ''}/${item.paperSize || ''}`,
                    `${item.gsm || ''}/${item.mattGloss || ''}`,
                    item.print || '',
                    item.sheet || '',
                    `${item.Printrate || '0'} Rs.`,
                    `${amountPrint} Rs.`
                ];
    
                const row2 = [
                    ``,
                    `LAMINATION/${item.lamination}`,
                    `${item.laminationSides}`,
                    ``,
                    `${item.laminationsheet}`,
                    `${item.laminationRate || '0'} Rs. `,
                    `${amountLamination} Rs.`
                ];

                const row3 = [
                    ``,
                    `${item.cutType}`,
                    ``,
                    ``,
                    `${item.cutSheet}`,
                    `${item.halfCutShapeCutRate || '0'} Rs. `,
                    `${amountHSCut} Rs.`
                ];
                const row4 = [
                    ``,
                    `Cutting`,
                    `${item.cutting}`,
                    ``,
                    `${item.normalCuttingSheet}`,
                    `${item.cuttingRate || '0'} Rs. `,
                    `${amountCutting} Rs.`
                ];
                const row5 = [
                    ``,
                    `Binding`,
                    `${item.bindingType}`,
                    ``,
                    `${item.bindingSheet}`,
                    `${item.bindingRate || '0'} Rs. `,
                    `${amountBinding} Rs.`
                ];
        

                if(item.isPrint=='true')
                    {
                        tableRows.push(row1);
                    }
                if(item.isLamination=='true')
                    {
                        tableRows.push(row2);
                    }
                if(item.isHSCutting=='true')
                    {
                        tableRows.push(row3);
                    }
                if(item.isNormalCutting=='true')
                {
                    tableRows.push(row4);
                }
                if(item.isBinding=='true')
                    {
                        tableRows.push(row5);
                    }
                
                TotalAmount+=amountTotal;
            });
        }
        GSTAmount=(0.18*TotalAmount).toFixed(2);
        GrandTotal=(TotalAmount+parseFloat(GSTAmount)).toFixed(2);
        // Table
        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            styles: {
                cellPadding: 2,
                fontSize: 8,
            },
            columnStyles: {
                0: { cellWidth: 15 }, // ITEM
                1: { cellWidth: 30 }, // PAPER
                2: { cellWidth: 20 }, // GSM
                3: { cellWidth: 20 }, // PRINT
                4: { cellWidth: 20 }, // SHEET
                5: { cellWidth: 30 }, // RATE
                6: { cellWidth: 30 }, // AMOUNT
            }
        });
    
        // Additional information
        doc.text(`Party Name: ${data.partyNameOrder}`, 10, 10);
        doc.text(`Date: ${date}`, 10, 15);
        
        // Show Final Amount and GST
        doc.text(`Total Amount: ${TotalAmount.toFixed(2)} Rs.`, 10, doc.autoTable.previous.finalY + 10);
        doc.text(`GST @ 18%: ${GSTAmount} Rs.`, 10, doc.autoTable.previous.finalY + 15);
        doc.text(`Grand Total : ${Math.round(GrandTotal)} Rs.`, 10, doc.autoTable.previous.finalY + 20);
    
        return doc;
    }
    
    function sendWhatsAppMessage(data, pdfUrl) {
        let message = `Order Details:
Date: ${data.orderDate}
Party Name: ${data.partyNameOrder}`;

        if (Array.isArray(data.items)) {
            data.items.forEach((item, index) => {
                message += `
Item ${index + 1}:
GSM: ${item.gsm}
Print: ${item.print}
Sheet: ${item.sheet}
Rate: ${item.rate}
Amount: ${Math.round(item.amount)}`;
            });
        }

        const whatsappUrl = `https://wa.me/+91${data.contactDetailsOrder}?text="Hello Sir"`;
        window.open(whatsappUrl, '_blank');
    }

    // Show update form for rate
    function showUpdateRateForm(orderId, itemIndex, currentRate, printValue) {
        const newPrintRate = prompt("Enter Print Rate:", currentRate);
        const newLaminationRate = prompt("Enter Lamination Rate:", '');
        const newCuttingRate = prompt("Enter Cutting Rate:", '');
        if (newPrintRate !== null && newLaminationRate !== null && newCuttingRate !== null) {
            updateOrderRateAndAmount(orderId, itemIndex, newPrintRate, newLaminationRate, newCuttingRate, printValue);
        }
    }
    
    async function updateOrderRateAndAmount(orderId, itemIndex, newPrintRate, newLaminationRate, newCuttingRate, printValue) {
        try {
            const orderDoc = await db.collection('orders').doc(orderId).get();
            if (orderDoc.exists) {
                const orderData = orderDoc.data();
                const item = orderData.items[itemIndex];
                var laminationSideNum = 1;
                if (orderData.items[itemIndex].laminationSides == "Double Side") {
                    laminationSideNum = 2;
                }
                const printAmount = newPrintRate * (item.print ?? 1);
                const laminationAmount = newLaminationRate * (laminationSideNum * item.laminationsheet ?? 1);
                const cuttingAmount = newCuttingRate * (item.cuttingsheet ?? 1);
                const baseAmount = printAmount + laminationAmount + cuttingAmount;
                const gstAmount = baseAmount * 0.18;
                const newAmount = Math.round(baseAmount + gstAmount);
                orderData.items[itemIndex].Printrate = newPrintRate;
                orderData.items[itemIndex].laminationRate = newLaminationRate;
                orderData.items[itemIndex].cuttingRate = newCuttingRate;
                orderData.items[itemIndex].amount = newAmount;
    
                await db.collection('orders').doc(orderId).update(orderData);
                alert('Rates and amount updated successfully');
                fetchOrders();
            } else {
                console.error('Order not found');
            }
        } catch (error) {
            console.error('Error updating order: ', error);
        }
    }

    // Fetch and display orders
    async function fetchOrders() {
        const selectedDate = orderDatePicker.value;
        ordersContainer.innerHTML = ''; // Clear the container before appending new orders

        try {
            const querySnapshot = await db.collection('orders').where('orderDate', '==', selectedDate).get();
            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.completed === showCompleted) {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.dataset.id = doc.id;

                    orderItem.innerHTML = `
                        <p style="font-size: 20px;"><strong>Order ID: </strong> ${data.orderID ?? 'N/A'}</p>
                        <p style="font-size: 20px;"><strong>Date:</strong> ${data.orderDate ?? 'N/A'}</p>
                        <p style="font-size: 20px;"><strong>Party Name:</strong> ${data.partyNameOrder ?? 'N/A'}</p>
                        <p style="font-size: 20px;"><strong>Contact:</strong> ${data.contactDetailsOrder ?? 'N/A'}</p>
                        <button class="btn toggle-order-details" data-id="${doc.id}">Show More</button>
                        ${data.completed ? `
                        <button class="btn print-order" data-id="${doc.id}">Print</button>
                        <button class="btn whatsapp-order" data-id="${doc.id}" data-contact="${data.contactDetailsOrder}">WhatsApp</button>` : `
                        <button class="btn complete-order" data-id="${doc.id}">Mark as Completed</button>`}
                    `;

                    ordersContainer.appendChild(orderItem);

                    const toggleOrderDetailsButton = orderItem.querySelector('.toggle-order-details');
                    toggleOrderDetailsButton.addEventListener('click', () => {
                        const detailsContainer = orderItem.querySelector('.order-details');
                        if (detailsContainer) {
                            // Remove details if they already exist
                            orderItem.removeChild(detailsContainer);
                            toggleOrderDetailsButton.textContent = 'Show More';
                        } else {
                            // Fetch and show details if they don't exist
                            showOrderDetails(doc.id, orderItem);
                            toggleOrderDetailsButton.textContent = 'Show Less';
                        }
                    });

                    if (!data.completed) {
                        const completeOrderButton = orderItem.querySelector('.complete-order');
                        completeOrderButton.addEventListener('click', async () => {
                            try {
                                await db.collection('orders').doc(doc.id).update({ completed: true });
                                alert('Order marked as completed');
                                fetchOrders();
                            } catch (error) {
                                console.error('Error updating order: ', error);
                            }
                        });

                        const updateRateButtons = orderItem.querySelectorAll('.update-rate');
                        updateRateButtons.forEach(button => {
                            button.addEventListener('click', () => {
                                const itemIndex = button.getAttribute('data-index');
                                const currentRate = button.getAttribute('data-rate');
                                const printValue = button.getAttribute('data-print');
                                showUpdateRateForm(doc.id, itemIndex, currentRate, printValue);
                            });
                        });
                    } else {
                        const printOrderButton = orderItem.querySelector('.print-order');
                        const whatsappOrderButton = orderItem.querySelector('.whatsapp-order');

                        const generateAndSendPDF = async () => {
                            const pdf = generatePDF(data);
                            const pdfBlob = pdf.output('blob');
                            const pdfUrl = URL.createObjectURL(pdfBlob);

                            printOrderButton.addEventListener('click', () => {
                                pdf.save(`${data.partyNameOrder}_${data.orderDate}_${data.orderID}.pdf`);
                            });

                            whatsappOrderButton.addEventListener('click', () => {
                                sendWhatsAppMessage(data, pdfUrl);
                            });
                        };
                        generateAndSendPDF();
                    }
                }
            });
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
    }

    // Show order details
    async function showOrderDetails(orderId, orderItem) {
        try {
            const orderDoc = await db.collection('orders').doc(orderId).get();
            if (orderDoc.exists) {
                const data = orderDoc.data();
                const detailsContainer = document.createElement('div');
                detailsContainer.className = 'order-details';

                let itemsHTML = '';
                if (Array.isArray(data.items)) {
                    data.items.forEach((item, index) => {
                        itemsHTML += `
                            <div class="item-details" style="background-color:grey; border-radius:5px; padding:2px;">
                                <p style="font-size: 20px;"><strong>Item ${index + 1}:</strong></p>
                                <p><strong>Paper Type:</strong> ${item.papertype ?? 'N/A'}</p>
                                <p><strong>Paper Size:</strong> ${item.paperSize ?? 'N/A'}</p>
                                <p><strong>GSM:</strong> ${item.gsm ?? 'N/A'}</p>
                                <p><strong>Matt or Gloss:</strong> ${item.mattGloss ?? 'N/A'}</p>
                                <p><strong>Side Print:</strong> ${item.sidePrint ?? 'N/A'}</p>
                                <p><strong>Print:</strong> ${item.print ?? 'N/A'}</p>
                                <p><strong>Sheet:</strong> ${item.sheet ?? 'N/A'}</p>
                                <p><strong>Lamination:</strong> ${item.lamination ?? 'N/A'}</p>
                                <p><strong>Lamination sides:</strong> ${item.laminationSides ?? 'N/A'}</p>
                                <p><strong>Lamination sheet:</strong> ${item.laminationsheet ?? 'N/A'}</p>
                                <p><strong>Half or Shape Cut:</strong> ${item.cutType ?? 'N/A'}</p>
                                <p><strong>Cutting remark:</strong> ${item.cutting ?? 'N/A'}</p>
                                <p><strong>Cutting sheet:</strong> ${item.cuttingsheet ?? 'N/A'}</p>
                                <p><strong>Remark:</strong> ${item.remark ?? 'N/A'}</p>
                                <p><strong>Printing Rate:</strong> ${item.Printrate ?? 'N/A'} Rs.</p>
                                <p><strong>Lamination Rate:</strong> ${item.laminationRate ?? 'N/A'} Rs.</p>
                                <p><strong>Cutting Rate:</strong> ${item.cuttingRate ?? 'N/A'} Rs.</p>
                                <p><strong>Amount:</strong> ${item.amount ?? 'N/A'}</p>
                                ${data.completed ? '' : `<button class="btn update-rate" data-id="${orderId}" data-index="${index}" data-rate="${item.rate}" data-print="${item.print}">Add Rate</button>`}
                                <hr>
                            </div>
                        `;
                    });
                } else {
                    itemsHTML = '<p>No items found</p>';
                }

                detailsContainer.innerHTML = `
                    <p style="font-size: 20px;"><strong>Order ID: </strong> ${data.orderID ?? 'N/A'}</p>
                    <p style="font-size: 20px;"><strong>Date:</strong> ${data.orderDate ?? 'N/A'}</p>
                    <p style="font-size: 20px;"><strong>Party Name:</strong> ${data.partyNameOrder ?? 'N/A'}</p>
                    <p style="font-size: 20px;"><strong>Contact:</strong> ${data.contactDetailsOrder ?? 'N/A'}</p>
                    ${itemsHTML}
                    ${data.completed ? `
                    <button class="btn print-order" data-id="${orderId}">Print</button>
                    <button class="btn whatsapp-order" data-id="${orderId}" data-contact="${data.contactDetailsOrder}">WhatsApp</button>` : `
                    <button class="btn complete-order" data-id="${orderId}">Mark as Completed</button>`}
                `;

                orderItem.appendChild(detailsContainer);

                if (!data.completed) {
                    const completeOrderButton = detailsContainer.querySelector('.complete-order');
                    completeOrderButton.addEventListener('click', async () => {
                        try {
                            await db.collection('orders').doc(orderId).update({ completed: true });
                            alert('Order marked as completed');
                            fetchOrders();
                        } catch (error) {
                            console.error('Error updating order: ', error);
                        }
                    });

                    const updateRateButtons = detailsContainer.querySelectorAll('.update-rate');
                    updateRateButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const itemIndex = button.getAttribute('data-index');
                            const currentRate = button.getAttribute('data-rate');
                            const printValue = button.getAttribute('data-print');
                            showUpdateRateForm(orderId, itemIndex, currentRate, printValue);
                        });
                    });
                } else {
                    const printOrderButton = detailsContainer.querySelector('.print-order');
                    const whatsappOrderButton = detailsContainer.querySelector('.whatsapp-order');

                    const generateAndSendPDF = async () => {
                        const pdf = generatePDF(data);
                        const pdfBlob = pdf.output('blob');
                        const pdfUrl = URL.createObjectURL(pdfBlob);

                        printOrderButton.addEventListener('click', () => {
                            pdf.save(`${data.partyNameOrder}_${data.orderDate}_${data.orderID}.pdf`);
                        });

                        whatsappOrderButton.addEventListener('click', () => {
                            sendWhatsAppMessage(data, pdfUrl);
                        });
                    };
                    generateAndSendPDF();
                }
            } else {
                console.error('Order not found');
            }
        } catch (error) {
            console.error('Error getting order details: ', error);
        }
    }

    // Fetch orders on date change
    orderDatePicker.addEventListener('change', fetchOrders);
    // Initial fetch
    fetchOrders();
    setInterval(fetchOrders, 50000);
});
