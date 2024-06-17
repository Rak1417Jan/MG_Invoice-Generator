// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHjq-h24a4RclTZFXs6fUAIrk78baUD3Q",
  authDomain: "mgdigitalpressjobcard.firebaseapp.com",
  projectId: "mgdigitalpressjobcard",
  storageBucket: "mgdigitalpressjobcard.appspot.com",
  messagingSenderId: "886245038190",
  appId: "1:886245038190:web:ad511ad2f7c9c685c3ae7f",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const addNewPartyButton = document.getElementById("addNewPartyButton");
  const goToOrdersButton = document.getElementById("goToOrdersButton");
  const newPartyModal = document.getElementById("newPartyModal");
  const addOrderModal = document.getElementById("addOrderModal");
  const closeModalButtons = document.querySelectorAll(".modal .close");

  // Add New Party Modal
  addNewPartyButton.addEventListener("click", () => {
    newPartyModal.style.display = "block";
  });

  // Go to Orders Page
  goToOrdersButton.addEventListener("click", () => {
    window.location.href = "orders.html";
  });

  // Close Modals
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.parentElement.style.display = "none";
    });
  });

  // Form Submission for Adding New Party
  const newPartyForm = document.getElementById("newPartyForm");
  newPartyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const partyName = event.target.partyName.value;
    const contactDetails = event.target.contactDetails.value;
    const mailId = event.target.mailId.value;
    const gstNumber = event.target.gstNumber.value;
    const address = event.target.address.value;

    try {
      await db.collection("parties").add({
        partyName,
        contactDetails,
        mailId,
        gstNumber,
        address,
      });
      alert("Party added successfully");
      newPartyModal.style.display = "none";
      newPartyForm.reset();
      window.location.reload();
    } catch (error) {
      console.error("Error adding party: ", error);
    }
  });

  // Add another item in the order form
  // Add another item in the order form
  const addItemButton = document.getElementById("addItemButton");
  addItemButton.addEventListener("click", () => {
    const orderItemsContainer = document.getElementById("orderItemsContainer");
    const newItem = document.createElement("div");
    newItem.classList.add("orderItem");
    newItem.innerHTML = `
   <br>
                        <hr>
                        <br>
                        <label for="papertype">Paper Type: </label>
                        <select id="papertype" name="papertype">
                            <option value="InitialOption">Select</option>
                            <option value="Art paper">Art paper</option>
                            <option value="Gumming">Gumming</option>
                            <option value="Others">Others</option>
                        </select>
                        <label for="paperSize">Paper Size: </label>
                        <select id="paperSize" name="paperSize">
                            <option value="InitialOption">Select</option>
                            <option value="12X18">12X18</option>
                            <option value="13X19">13X19</option>
                            <option value="Others">Others</option>
                        </select>
                        <label for="gsm">GSM:</label>
                        <select id="gsm" name="gsm">
                            <option value="InitialOption">Select</option>
                            <option value="120">120</option>
                            <option value="130">130</option>
                            <option value="Others">Others</option>
                        </select>
                        <br>
                        <br>
                        <label for="mattGloss">Matt or Gloss:</label>
                        <select id="mattGloss" name="mattGloss">
                            <option value="InitialOption">Select</option>
                            <option value="Matt">Matt</option>
                            <option value="Gloss">Gloss</option>
                        </select>
                        <label for="sidePrint">Single or Double Side:</label>
                        <select id="sidePrint" name="sidePrint">
                            <option value="InitialOption">Select</option>
                            <option value="Single Side">Single Side</option>
                            <option value="Double Side">Double Side</option>
                        </select>
                        <br>
                        <br>
                        <div class="input-group">
                            <label for="sheet">Sheet:</label>
                            <input type="text" id="sheet" name="sheet">
                            <label for="print">Print:</label>
                            <input type="text" id="print" name="print" readonly>
                        </div>                        
                        <label for="laminationCheckbox">Lamination:</label>
                        <input type="checkbox" id="laminationCheckbox" name="laminationCheckbox">
                        <div class="lamination-fields" style="display: none;">
                            <label for="lamination">Lamination:</label>
                            <select id="lamination" name="lamination">
                                <option value="None">None</option>
                                <option value="Matt Lamination">Matt Lamination</option>
                                <option value="Gloss Lamination">Gloss Lamination</option>
                            </select>
                            <label for="laminationSides">Lamination Sides:</label>
                            <select id="laminationSides" name="laminationSides">
                                <option value="None">None</option>
                                <option value="Single Side">Single Side</option>
                                <option value="Double Side">Double Side</option>
                            </select>
                            <br>
                            <label for="laminationsheet">Lamination Sheet:</label>
                            <input type="text" id="laminationsheet" name="laminationsheet" >
                        </div>
                        <label for="cuttingCheckbox">Half Cut or Shape Cut</label>
                        <input type="checkbox" id="cuttingCheckbox" name="cuttingCheckbox">
                        <div class="cutting-fields" style="display: none;">
                            <label for="cutType">Half Cut or Shape Cut:</label>
                            <select id="cutType" name="cutType">
                                <option value="None">None</option>
                                <option value="Half Cut">Half Cut</option>
                                <option value="Shape Cut">Shape Cut</option>
                            </select>
                            <br>
                            <label for="cuttingsheet">cutting Sheet:</label>
                            <input type="text" id="cuttingsheet" name="cuttingsheet">
                        </div>
                        <label for="normalCuttingCheckbox">Cutting</label>
                        <input type="checkbox" id="normalCuttingCheckbox" name="normalCuttingCheckbox">
                        <div class="normalCuttingFields" style="display: none;">
                            <label for="cutting">Cutting Remark:</label>
                            <input type="text" id="cutting" name="cutting">
                            <label for="normalcuttingsheet">cutting Sheet:</label>
                            <input type="text" id="normalcuttingsheet" name="normalcuttingsheet">
                        </div>
                        <label for="bindingCheckbox">Binding</label>
                        <input type="checkbox" id="bindingCheckbox" name="bindingCheckbox">
                        <div class="bindingFields" style="display: none;">
                            <label for="bindingType">Binding Type :</label>
                            <select name="bindingType" id="bindingType">
                                <option value="Glue binding">Glue binding</option>
                                <option value="Center Pining">Center Pining</option>
                            </select>
                            <br>
                            <label for="bindingSheet">Binding Sheets</label>
                            <input type="text" id="bindingSheet" name="bindingSheet">
                        </div>
                        <label for="remark">Remark:</label>
                        <input type="text" id="remark" name="remark">
                        <button type="button" class="removeItemButton btn">Remove Item</button>
                    </div>
                </div>
    `;
    orderItemsContainer.appendChild(newItem);

    // Show/Hide lamination fields
    const laminationCheckbox = newItem.querySelector('[name="laminationCheckbox"]');
    const laminationFields = newItem.querySelector('.lamination-fields');
    laminationCheckbox.addEventListener('change', () => {
      laminationFields.style.display = laminationCheckbox.checked ? 'block' : 'none';
    });

    // Show/Hide cutting fields
    const cuttingCheckbox = newItem.querySelector('[name="cuttingCheckbox"]');
    const cuttingFields = newItem.querySelector('.cutting-fields');
    cuttingCheckbox.addEventListener('change', () => {
      cuttingFields.style.display = cuttingCheckbox.checked ? 'block' : 'none';
    });

    orderItemsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('removeItemButton')) {
          const orderItem = event.target.closest('.orderItem');
          orderItemsContainer.removeChild(orderItem);
      }
  });

    // Update the print field based on the selected sidePrint
    newItem.querySelector('[name="sidePrint"]').addEventListener("change", function () {
      const sheet = newItem.querySelector('[name="sheet"]').value;
      const printField = newItem.querySelector('[name="print"]');
      printField.value = this.value === "Single Side" ? sheet : sheet * 2;
    });

    // Automatically update print field when sheet value changes
    newItem.querySelector('[name="sheet"]').addEventListener("input", function () {
      const sidePrint = newItem.querySelector('[name="sidePrint"]').value;
      const printField = newItem.querySelector('[name="print"]');
      printField.value = sidePrint === "Single Side" ? this.value : this.value * 2;
    });

    
  });

  // Form Submission for Adding Order
  const addOrderForm = document.getElementById("addOrderForm");
  addOrderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const orderDate = event.target.orderDate.value;
    const partyNameOrder = event.target.partyNameOrder.value;
    const contactDetailsOrder = event.target.contactDetailsOrder.value;
    const orderItemsContainer = document.getElementById("orderItemsContainer");
    const orderItems = orderItemsContainer.querySelectorAll(".orderItem");

    const items = Array.from(orderItems).map((orderItem) => {
      return {
        papertype: orderItem.querySelector('[name="papertype"]').value,
        paperSize: orderItem.querySelector('[name="paperSize"]').value,
        gsm: orderItem.querySelector('[name="gsm"]').value,
        mattGloss: orderItem.querySelector('[name="mattGloss"]').value,
        sidePrint: orderItem.querySelector('[name="sidePrint"]').value,
        sheet: orderItem.querySelector('[name="sheet"]').value,
        print: orderItem.querySelector('[name="print"]').value,
        // laminationCheck:orderItem.querySelector['[name="laminationCheckbox"]'].checked ? 'true' : 'false',
        lamination: orderItem.querySelector('[name="laminationCheckbox"]').checked ? orderItem.querySelector('[name="lamination"]').value : 'None',
        laminationSides:orderItem.querySelector('[name="laminationSides"]').value,
        laminationsheet:orderItem.querySelector('[name="laminationsheet"]').value,
        // laminationRate: orderItem.querySelector('[name="laminationCheckbox"]').checked ? orderItem.querySelector('[name="laminationRate"]').value : 0,
        laminationRate: 0,
        // cuttingCheck:orderItem.querySelector('[name="cuttingCheckbox"]').checked ? 'true' : 'false',
        cutType: orderItem.querySelector('[name="cuttingCheckbox"]').checked ? orderItem.querySelector('[name="cutType"]').value : 'None',
        cutSheet: orderItem.querySelector('[name="cuttingsheet"]').value,
        cutting: orderItem.querySelector('[name="normalCuttingCheckbox"]').checked ? orderItem.querySelector('[name="cutting"]').value : '',
        normalCuttingSheet : orderItem.querySelector('[name="normalcuttingsheet"]').value,
        bindingType : orderItem.querySelector('[name="bindingCheckbox"]').checked ? orderItem.querySelector('[name="bindingType"]').value : 'None',
        bindingSheet : orderItem.querySelector('[name="bindingSheet"]').value,
        // cuttingRate: orderItem.querySelector('[name="cuttingCheckbox"]').checked ? orderItem.querySelector('[name="cuttingRate"]').value : 0,
        remark: orderItem.querySelector('[name="remark"]').value,
        isPrint:(String(orderItem.querySelector('[name="papertype"]').value[0]==='I')) ? 'true' : 'false',
        isLamination:orderItem.querySelector('[name="laminationCheckbox"]').checked ? 'true' : 'false',
        isHSCutting:orderItem.querySelector('[name="cuttingCheckbox"]').checked ? 'true' : 'false',
        isNormalCutting:orderItem.querySelector('[name="normalCuttingCheckbox"]').checked ? 'true' : 'false',
        isBinding : orderItem.querySelector('[name="bindingCheckbox"]').checked ? 'true' : 'false',
        halfCutShapeCutRate: 0,
        cuttingRate: 0,
        Printrate: 0, // Placeholder for the print rate
        bindingRate : 0,
        amount: 0 // Placeholder for the final amount
      };
    });

    try {
      const ordersCountSnapshot = await db.collection("orders").get();
      const ordersCount = ordersCountSnapshot.size;

      // Set the order ID as count + 1
      const orderID = ordersCount + 1;
      await db.collection("orders").add({
        orderID,
        orderDate,
        partyNameOrder,
        contactDetailsOrder,
        items,
        completed: false,
      });
      alert("Order added successfully");
      addOrderModal.style.display = "none";
      addOrderForm.reset();
      orderItemsContainer.innerHTML = "";
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  });

  // Fetch and display parties
  async function fetchParties() {
    const partyList = document.querySelector(".party-list");
    partyList.innerHTML = "";

    try {
      const querySnapshot = await db.collection("parties").get();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const partyItem = document.createElement("div");
        partyItem.className = "party-item";

        partyItem.innerHTML = `
                    <div class="party-info">
                        <h3>${data.partyName} - ${data.contactDetails}</h3>
                        <button class="btn view-more" data-id="${doc.id}">View more</button>
                        <button class="btn add-order" data-name="${data.partyName}" data-contact="${data.contactDetails}">Add Order</button>
                    </div>
                    <div class="party-details" id="details-${doc.id}" style="display: none;">
                        <p>Mail ID: ${data.mailId}</p>
                        <p>GST Number: ${data.gstNumber}</p>
                        <p>Address: ${data.address}</p>
                    </div>
                `;

        // View More Button
        const viewMoreButton = partyItem.querySelector(".view-more");
        viewMoreButton.addEventListener("click", () => {
          const details = document.getElementById(`details-${doc.id}`);
          if (details.style.display === "none") {
            details.style.display = "block";
            viewMoreButton.textContent = "View less";
          } else {
            details.style.display = "none";
            viewMoreButton.textContent = "View more";
          }
        });

        // Add Order Button
        const addOrderButton = partyItem.querySelector(".add-order");
        addOrderButton.addEventListener("click", () => {
          addOrderModal.style.display = "block";
          document.getElementById("orderDate").value = new Date()
            .toISOString()
            .slice(0, 10); // Automatically set to today's date
          document.getElementById("partyNameOrder").value =
            addOrderButton.dataset.name;
          document.getElementById("contactDetailsOrder").value =
            addOrderButton.dataset.contact;
        });

        partyList.appendChild(partyItem);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  // Initial fetch
  fetchParties();
});
