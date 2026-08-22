// https://vercel.com/my-team/my-site/deployments
document.querySelectorAll("a[aria-label~=deployment]").forEach((el) => {
  const btn = el.parentNode.appendChild(document.createElement("button"));
  btn.style =
    "position:absolute;inset:0 0 0 auto;z-index:32;background:Canvas;border:1px solid";
  btn.textContent = "DEL";
  btn.onclick = () => {
    const id = el.href.split("/").pop();
    fetch(`/api/v2/deployments/dpl_${id}`, { method: "DELETE" });
    btn.remove();
  };
});
