const { addNewOrderForm } = document;

addNewOrderForm?.client?.addEventListener('change', async (e) => {
  const response = await fetch(`/clients/all/?lastName=${e.target.value}`);
  const allClients = await response.json();
  console.log(allClients);
  const names = allClients.map((el) => `<p data-id="${el._id}">${el.lastname} ${el.name} ${el.middlename}</p>`).join('');
  let id;
  e.target.insertAdjacentHTML('afterend', `<div data-find>${names}</div>`);

  const namesDiv = document.querySelector('[data-find]');

  function findNamesOfClients(ev) {
    if (ev.target.dataset.id) {
      e.target.value = ev.target.innerText;
      id = ev.target.dataset.id;
      namesDiv.removeEventListener('click', findNamesOfClients);
      namesDiv.remove();
    }
  }
  if (namesDiv) {
    namesDiv.addEventListener('click', findNamesOfClients);
  }

  addNewOrderForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const {
      title,
      deliveryadress,
      deliverydate,
      assemblydate,
      orderprice,
      payment,
      deliveryprice,
      assemblyprice,
    } = addNewOrderForm;
    const response = await fetch('/orders/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.value,
        client: id,
        deliveryadress: deliveryadress.value,
        deliverydate: deliverydate.value,
        assemblydate: assemblydate.value,
        orderprice: orderprice.value,
        payment: payment.value,
        deliveryprice: deliveryprice.value,
        assemblyprice: assemblyprice.value,
      }),
    });
    if (response.status === 200) window.location.replace(`/clients/${id}`);
  });
});

const { addCommentClient } = document;
const { addCommentOrder } = document;
const { findClients } = document;
const { findOrders } = document;
const { changeStatus } = document;

addCommentClient?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = addCommentClient.texOfComment.value;
  const { id } = addCommentClient.dataset;
  const response = await fetch(`/clients/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  addCommentClient.texOfComment.value = '';
  if (response.status === 200) {
    const resBody = await response.json();
    const list = document.querySelector('.listOfComment');
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (resBody.isAdmin) {
      div.innerText = `admin: ${resBody.text}`;
    } else div.innerText = `${resBody.lastname} ${resBody.name} ${resBody.middlname}: ${resBody.text}`;
    li.append(div);
    list.appendChild(li);
  }
});

addCommentOrder?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = addCommentOrder.texOfComment.value;
  const { id } = addCommentOrder.dataset;
  const response = await fetch(`/orders/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  addCommentOrder.texOfComment.value = '';
  if (response.status === 200) {
    const resBody = await response.json();
    const list = document.querySelector('.listOfComment');
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (resBody.isAdmin) {
      div.innerText = `admin: ${resBody.text}`;
    } else div.innerText = `${resBody.lastname} ${resBody.name} ${resBody.middlname}: ${resBody.text}`;
    li.append(div);
    list.appendChild(li);
  }
});

let timeoutID;

async function checkFiltr() {
  const text = findClients.name.value;
  const response = await fetch('/clients/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const resBody = await response.json();

  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = '';
  resBody.clients.forEach((client) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    const a = document.createElement('a');
    a.href = `/clients/${client._id}`;
    a.style.textDecoration = 'none';
    a.innerText = `${client.lastname} ${client.name} ${client.middlename}`;
    const span = document.createElement('span');
    span.classList.add('badge', 'bg-primary', 'rounded-pill');
    span.innerText = client.orders.length;
    li.append(a);
    li.append(span);
    listGroup.append(li);
  });
}

async function checkFiltrByOrder() {
  const text = findOrders.name.value;
  const response = await fetch('/orders/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const resBody = await response.json();

  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = '';
  resBody.orders.forEach((order) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.href = `/clients/${order._id}`;
    a.style.textDecoration = 'none';
    a.innerText = `${order.number} ${order.title} ${order.status}`;
    li.append(a);
    listGroup.append(li);
  });
}

function delayFiltr() {
  window.clearTimeout(timeoutID);
  timeoutID = window.setTimeout(checkFiltr, 300);
}

function delayFiltrByOrder() {
  window.clearTimeout(timeoutID);
  timeoutID = window.setTimeout(checkFiltrByOrder, 300);
}

findClients?.addEventListener('input', delayFiltr);
findOrders?.addEventListener('input', delayFiltrByOrder);

changeStatus?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = changeStatus.statusSelect.value;
  console.log(status);
  const response = await fetch(`/orders/${changeStatus.dataset.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  // const resBody = await response.json();
  if (response.status === 200) {
    document.getElementById('status').innerHTML = `Текущий статус: ${status}`;
  }
});
