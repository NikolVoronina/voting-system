document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("voteForm").addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const voterCode = document.getElementById("voterCode").value;
      const birthDate = document.getElementById("birthDate").value;  // Получаем дату рождения
      const partyName = document.querySelector('input[name="party"]:checked').value;
  
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterCode, birthDate, partyName })  
      });
  
      const result = await response.json();
      document.getElementById("message").textContent = result.message || result.error;
    });
  });
  