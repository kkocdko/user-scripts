document
  .querySelectorAll('div[data-testid="deployment-entity/target"] a')
  .forEach((el) => {
    const btn = el.parentNode.appendChild(document.createElement("button"));
    btn.style = "position:absolute;inset:0 0 0 auto;z-index:128";
    btn.textContent = "DEL";
    btn.onclick = () => {
      const id = el.href.split("/").pop();
      fetch(`/api/v2/deployments/dpl_${id}`, { method: "DELETE" });
    };
  });
