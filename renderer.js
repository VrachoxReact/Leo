document.addEventListener("DOMContentLoaded", () => {
  const addBoxerBtn = document.getElementById("addBoxerBtn");
  const searchInput = document.getElementById("searchInput");

  function addBoxerToTable(boxer) {
    const table = document
      .getElementById("boxersTable")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td>${boxer.lastPaymentDate}</td>
      <td>${boxer.nextPaymentDue}</td>
      <td>${boxer.name}</td>
      <td>${boxer.surname}</td>
      <td><button class="deleteBtn" data-id="${boxer.id}">Delete</button></td>
    `;
    newRow.querySelector(".deleteBtn").addEventListener("click", function () {
      window.electronAPI.deleteBoxer(boxer.id).then(() => newRow.remove());
    });
  }

  addBoxerBtn.addEventListener("click", () => {
    const boxerData = {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      dateOfEnrollment: document.getElementById("dateOfEnrollment").value,
      address: document.getElementById("address").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      city: document.getElementById("city").value,
      identificationNumber: document.getElementById("identificationNumber")
        .value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
      type: document.getElementById("type").value,
      numberOfFights: document.getElementById("numberOfFights").value,
      lastMedicalExam: document.getElementById("lastMedicalExam").value,
      lastPaymentDate: document.getElementById("lastPaymentDate").value,
      nextPaymentDue: document.getElementById("nextPaymentDue").value,
    };
    window.electronAPI.addBoxer(boxerData).then((id) => {
      boxerData.id = id;
      addBoxerToTable(boxerData);
    });
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll("#boxersTable tbody tr").forEach((row) => {
      const isVisible = Array.from(row.cells).some((cell) =>
        cell.textContent.toLowerCase().includes(searchTerm)
      );
      row.style.display = isVisible ? "" : "none";
    });
  });
});
