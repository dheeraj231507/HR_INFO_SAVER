/***********************
 EMAILJS SETUP
***********************/
(function () {
  emailjs.init({
    publicKey: "gPL0O2x3ThDEEjpG_",
  });
})();



/***********************
 DOM ELEMENTS
***********************/
const form = document.getElementById("hrForm");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const statusText = document.getElementById("status");

/***********************
 SAVE / UPDATE DATA
***********************/
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let records = JSON.parse(localStorage.getItem("hrData")) || [];

  const data = {
    hrName: hrName.value,
    company: companyName.value,
    role: role.value,
    email: email.value,
    phone: phone.value,
    createdAt: Date.now()
  };

  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    records.push(data);
    statusText.innerText = "✅ HR Data Saved";
  } else {
    records[editIndex] = data;
    statusText.innerText = "✏️ HR Data Updated";
    document.getElementById("editIndex").value = "";
  }

  localStorage.setItem("hrData", JSON.stringify(records));
  form.reset();
  renderTable();
});

/***********************
 RENDER TABLE
***********************/
function renderTable(filter = "") {
  tableBody.innerHTML = "";
  let records = JSON.parse(localStorage.getItem("hrData")) || [];

  records.forEach((r, index) => {
    if (
      r.hrName.toLowerCase().includes(filter) ||
      r.company.toLowerCase().includes(filter) ||
      r.role.toLowerCase().includes(filter)
    ) {
      tableBody.innerHTML += `
        <tr>
          <td>${r.hrName}</td>
          <td>${r.company}</td>
          <td>${r.role}</td>
          <td>${r.email}</td>
          <td>${r.phone}</td>
          <td>${new Date(r.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="action-btn edit" onclick="editData(${index})">Edit</button>
            <button class="action-btn delete" onclick="deleteData(${index})">Delete</button>
          </td>
        </tr>`;
    }
  });
}

/***********************
 DELETE
***********************/
function deleteData(index) {
  let records = JSON.parse(localStorage.getItem("hrData"));
  if (confirm("Delete this HR record?")) {
    records.splice(index, 1);
    localStorage.setItem("hrData", JSON.stringify(records));
    renderTable();
  }
}

/***********************
 EDIT
***********************/
function editData(index) {
  let records = JSON.parse(localStorage.getItem("hrData"));
  const r = records[index];

  hrName.value = r.hrName;
  companyName.value = r.company;
  role.value = r.role;
  email.value = r.email;
  phone.value = r.phone;
  document.getElementById("editIndex").value = index;
}

/***********************
 SEARCH
***********************/
searchInput.addEventListener("input", () => {
  renderTable(searchInput.value.toLowerCase());
});

/***********************
 WEEKLY EMAIL
***********************/
function checkAndSendEmail() {
  const records = JSON.parse(localStorage.getItem("hrData")) || [];
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  const now = Date.now();

  const oldRecords = records.filter(r => now - r.createdAt >= ONE_WEEK);

  if (oldRecords.length) sendEmail(oldRecords);
}

/***********************
 SEND EMAIL
***********************/
function sendEmail(data) {
  let message = data.map(d =>
    `HR: ${d.hrName}
Company: ${d.company}
Role: ${d.role}
Email: ${d.email}
Phone: ${d.phone}
----------------`
  ).join("\n");

  emailjs.send("service_64zs6ph", "template_iifwy5f", {
    to_email: "dheerajkumawat0707@gmail.com",
    message: message
  })
  .then(() => alert("📧 Weekly HR Report Sent!"))
  .catch(err => console.error(err));
}

/***********************
 LOAD
***********************/
window.onload = function () {
  renderTable();
  checkAndSendEmail();
};
