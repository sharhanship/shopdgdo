document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code-area").forEach((area) => {
    const tbody = area.querySelector("tbody");
    const code = area.dataset.code;
    const lines = code.trim().split("\n");

    lines.forEach((line, index) => {
      const tr = document.createElement("tr");

      const tdNum = document.createElement("td");
      tdNum.className = "line-number";
      tdNum.textContent = index + 1;

      const tdCode = document.createElement("td");
      tdCode.innerHTML = line;

      tr.appendChild(tdNum);
      tr.appendChild(tdCode);
      tbody.appendChild(tr);
    });
  });
});

function copyCode(btn) {
  const code = btn.nextElementSibling.dataset.code
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  navigator.clipboard.writeText(code).then(() => {
    btn.innerText = "✅";
    setTimeout(() => (btn.innerText = "📋"), 1500);
  });
}
