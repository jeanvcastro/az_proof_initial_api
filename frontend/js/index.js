const inputDate = document.querySelector("#input-date");
const btnFilter = document.querySelector("#btn-filter");

// Index

const renderDashboard = (data) => {
  const formatBRL = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  document.querySelector("#orders").innerHTML = data.orders_count;
  document.querySelector("#sales").innerHTML = data.sales_count;
  document.querySelector("#average-ticket").innerHTML = formatBRL.format(data.average_ticket);

  let content = "";
  data.orders.forEach((order) => {
    content += `<tr>
                         <td>${order._id}</td>
                         <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                         <td>${order.customer.name}</td>
                         <td>${order.customer.doc}</td>
                         <td>${capitalize(order.status)}</td>
                         <td>${capitalize(order.payment.status)}</td>
                         <td>${capitalize(order.payment.method)}</td>
                         <td>${formatBRL.format(order.payment.amount)}</td>
                      </tr>`;
  });

  document.querySelector("#table-data").innerHTML = content;

  paginate(data);

  document.querySelector("#dashboard-container").style.display = "flex";
};

const index = (page = 1) => {
  const url =
    "http://localhost:3333/proof/dashboard?" +
    new URLSearchParams({
      createdAt: inputDate.value,
      page: page,
    });

  fetch(url, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        renderDashboard(data);
      }
    });
};

btnFilter.onclick = index;

index();

// Pagination
const paginate = (data) => {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const { page: currentPage, total_pages: lastPage, limit: perPage, total } = data;
  const displayMax = 4;
  const items = [];

  if (perPage >= total) return;
  if (lastPage <= displayMax) {
    for (let i = 1; i <= lastPage; i++) items.push(i);
  } else if (currentPage < displayMax - 1) {
    for (let i = 1; i < displayMax; i++) {
      items.push(i);
    }
    items.push(lastPage);
  } else {
    let prev = currentPage - 1;
    let next = currentPage + 1;
    items.push(1);
    if (prev > 1) items.push(prev);
    items.push(currentPage);
    if (next < lastPage) items.push(next);
    if (currentPage < lastPage) items.push(lastPage);
  }

  items.forEach((page) => {
    const item = `<li class="page-item ${page === currentPage ? "active" : ""}">
                            <span class="page-link">${page}</span>
                          </li>`;
    paginationContainer.insertAdjacentHTML("beforeend", item);
  });
};

document.onclick = (e) => {
  const target = e.target;
  if (target.classList.contains("page-link")) {
    const page = parseInt(target.innerHTML);
    index(page);
  }
};
