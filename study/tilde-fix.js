(function () {
  const style = document.createElement("style");
  style.textContent = `
    .tilde {
      display: inline-block;
      position: relative;
      top: 0.18em;
    }`;
  document.head.appendChild(style);

  function wrapTildes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.includes("~")) return NodeFilter.FILTER_REJECT;
        if (n.parentElement.closest(".tilde, script, style, textarea"))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split("~").forEach((part, i) => {
        if (i) {
          const span = document.createElement("span");
          span.className = "tilde";
          span.textContent = "~";
          frag.appendChild(span);
        }
        frag.appendChild(document.createTextNode(part));
      });
      node.replaceWith(frag);
    });
  }

  wrapTildes();
  new MutationObserver(wrapTildes).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();