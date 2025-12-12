document.getElementById("calculateBtn").addEventListener("click", function() {
  const birthdateValue = document.getElementById("birthdate").value;
  if (!birthdateValue) {
    document.getElementById("result").textContent = "Please select your birthdate.";
    return;
  }
  const birthdate = new Date(birthdateValue);
  const today = new Date();
  if (birthdate > today) {
    document.getElementById("result").textContent = "Birthdate cannot be in the future.";
    return;
  }
  let years = today.getFullYear() - birthdate.getFullYear();
  let months = today.getMonth() - birthdate.getMonth();
  let days = today.getDate() - birthdate.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  document.getElementById("result").textContent = `Your age is ${years} years, ${months} months, and ${days} days.`;
});
