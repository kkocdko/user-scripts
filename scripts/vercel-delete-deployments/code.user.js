document
  .querySelectorAll('div[data-testid="deployment-entity/target"] a')
  .forEach((el) => {
    el.style.display = "inline-flex";
    const btn = el.parentNode.appendChild(document.createElement("button"));
    btn.style.float = "right";
    btn.textContent = "DEL";
    btn.onclick = () => {
      const id = el.href.split("/").pop();
      fetch(`/api/v2/deployments/dpl_${id}`, { method: "DELETE" });
    };
  });
