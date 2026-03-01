

$("#add_entry").submit(function(event){
    event.preventDefault();
    this.submit(); // allow backend submit
});

$("#update_entry").submit(function(event){
    event.preventDefault(); // Update form ka default submit rok diya gaya hai


    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value'] // Form data ko object me convert kiya ja raha hai

    })

    console.log(data);

    var request = {
        "url": `http://localhost:3000/api/passwords/${data.id}`,
        "method": "PUT",
        "data": data // Backend ko update request bheji ja rahi hai

    }

   $.ajax(request).done(function(response){
    alert("Data updated successfully!");
    window.location.href = "/";
    });
})

if(window.location.pathname == "/"){
    // Delete logic sirf home page par chalega
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        // Delete button par click event lagaya gaya hai
        var id = $(this).attr("data-id")

        var request = {
            "url": `http://localhost:3000/api/passwords/${id}`,
            "method": "DELETE",
            // Backend ko delete request bheji ja rahi hai
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data deleted successfully!");
                location.reload()
                // Delete confirm hone ke baad page reload kiya jaata hai
            })
        }
    })
}
function togglePassword(id, btn) {
  fetch(`/api/passwords/${id}/show`)
    .then(res => res.json())
    .then(data => {
      const td = btn.closest("tr").querySelector(".password-cell");

      if (td.innerText === "******") {
        td.innerText = data.password;
        btn.innerText = "🙈";
      } else {
        td.innerText = "******";
        btn.innerText = "👁️";
      }
    })
    .catch(err => alert("Error showing password"));
}


document.addEventListener("DOMContentLoaded", function () {

  // 🔍 SEARCH
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      let filter = this.value.toLowerCase();
      let rows = document.querySelectorAll("tbody tr");

      rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });
  }

  // 🔐 PASSWORD STRENGTH
  const passwordInput = document.getElementById("password");
  const strengthMessage = document.getElementById("strengthMessage");

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const value = passwordInput.value;
      let strength = "";

      if (value.length < 6) {
        strength = "Weak";
        strengthMessage.style.color = "red";
      } else if (
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        value.length >= 8
      ) {
        strength = "Strong";
        strengthMessage.style.color = "green";
      } else {
        strength = "Medium";
        strengthMessage.style.color = "orange";
      }

      strengthMessage.textContent = strength;
    });
  }

  // ================= SESSION TIMER (IMPROVED) =================

const totalIdleTime = 5 * 60 * 1000; // 5 min
const warningTime = 4 * 60 * 1000;   // show warning at 4 min
let logoutTimer;
let warningTimer;
let countdownInterval;

function createWarningModal() {
  if (document.getElementById("sessionModal")) return;

  const modal = document.createElement("div");
  modal.id = "sessionModal";
  modal.innerHTML = `
    <div style="
      position:fixed;
      top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.5);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:9999;">
      <div style="
        background:white;
        padding:20px;
        border-radius:8px;
        text-align:center;
        width:300px;">
        <h3>⚠ Session Expiring</h3>
        <p>Logging out in <span id="countdown">60</span> seconds</p>
        <button id="stayLoggedIn">Stay Logged In</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let timeLeft = 60;
  const countdownEl = document.getElementById("countdown");

  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      logoutUser();
    }
  }, 1000);

  document.getElementById("stayLoggedIn").addEventListener("click", () => {
    clearInterval(countdownInterval);
    modal.remove();
    resetTimers();
  });
}

function logoutUser() {
  window.location.href = "/logout";
}

function resetTimers() {
  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);

  const existingModal = document.getElementById("sessionModal");
  if (existingModal) existingModal.remove();
  clearInterval(countdownInterval);

  warningTimer = setTimeout(createWarningModal, warningTime);
  logoutTimer = setTimeout(logoutUser, totalIdleTime);
}

["mousemove", "keydown", "click", "scroll"].forEach(event => {
  document.addEventListener(event, resetTimers);
});

resetTimers();

});
