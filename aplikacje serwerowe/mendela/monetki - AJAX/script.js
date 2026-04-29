let meta = {
  kraje: [],
  stopy: [],
};

function request(params, onSuccess) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "ajax.php");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status !== 200) {
        setMessage("Błąd połączenia z serwerem.", true);
        return;
      }

      let response;
      try {
        response = JSON.parse(this.responseText);
      } catch (error) {
        setMessage("Nieprawidłowa odpowiedź serwera.", true);
        return;
      }

      if (!response.ok) {
        setMessage(response.message || "Wystąpił błąd.", true);
        return;
      }

      onSuccess(response);
    }
  };

  xhttp.send(params);
}

function setMessage(text, isError = false) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.style.color = isError ? "#b00020" : "#1b5e20";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text == null ? "" : String(text);
  return div.innerHTML;
}

function buildCountrySelect(selectedId, selectId) {
  let options = '<option value="">Kraj</option>';
  for (let i = 0; i < meta.kraje.length; i++) {
    const kraj = meta.kraje[i];
    const selected = Number(selectedId) === Number(kraj.id) ? "selected" : "";
    options += `<option value="${kraj.id}" ${selected}>${escapeHtml(kraj.kraj)}</option>`;
  }
  return `<select id="${selectId}" class="medium">${options}</select>`;
}

function buildStopSelect(selectedId, selectId) {
  let options = '<option value="">Stop</option>';
  for (let i = 0; i < meta.stopy.length; i++) {
    const stop = meta.stopy[i];
    const selected = Number(selectedId) === Number(stop.id) ? "selected" : "";
    options += `<option value="${stop.id}" ${selected}>${escapeHtml(stop.stop)}</option>`;
  }
  return `<select id="${selectId}" class="medium">${options}</select>`;
}

function renderAddRow() {
  const tbody = document.getElementById("add-row");
  tbody.innerHTML = `
		<tr>
			<td>-</td>
			<td>${buildCountrySelect("", "add-flaga")}</td>
			<td><input id="add-rok" class="small" type="number" min="1" placeholder="Rok"></td>
			<td><input id="add-nrkat" class="medium" type="text" placeholder="Nr kat"></td>
			<td><input id="add-nominal" class="medium" type="text" placeholder="Nominał"></td>
			<td>${buildStopSelect("", "add-stop")}</td>
			<td><button onclick="addRow()">Dodaj</button></td>
		</tr>
	`;
}

function renderRows(rows) {
  const tbody = document.getElementById("rows");
  tbody.innerHTML = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="../monetki/gfx/${escapeHtml(row.flaga_sciezka || "")}" width="50" alt="${escapeHtml(row.kraj || "")}"></td>
			<td>${buildCountrySelect(row.flaga_id, `flaga-${row.id}`)}</td>
			<td><input id="rok-${row.id}" class="small" type="number" min="1" value="${escapeHtml(row.rok)}"></td>
			<td><input id="nrkat-${row.id}" class="medium" type="text" value="${escapeHtml(row.nr_kat)}"></td>
			<td><input id="nominal-${row.id}" class="medium" type="text" value="${escapeHtml(row.nominal || "")}"></td>
			<td>${buildStopSelect(row.stop_id, `stop-${row.id}`)}</td>
			<td>
				<div class="row-actions">
					<button onclick="updateRow(${row.id})">Zapisz</button>
					<button onclick="deleteRow(${row.id})">Usuń</button>
				</div>
			</td>
		`;

    tbody.appendChild(tr);
  }
}

function loadRows() {
  request("acc=get", function (response) {
    renderRows(response.rows || []);
  });
}

function addRow() {
  const flagaId = document.getElementById("add-flaga").value;
  const rok = document.getElementById("add-rok").value;
  const nrKat = encodeURIComponent(
    document.getElementById("add-nrkat").value.trim(),
  );
  const nominal = encodeURIComponent(
    document.getElementById("add-nominal").value.trim(),
  );
  const stopId = document.getElementById("add-stop").value;

  const params = `acc=add&flaga_id=${flagaId}&rok=${rok}&nr_kat=${nrKat}&nominal=${nominal}&stop_id=${stopId}`;

  request(params, function () {
    setMessage("Dodano rekord.");
    loadRows();
    document.getElementById("add-rok").value = "";
    document.getElementById("add-nrkat").value = "";
    document.getElementById("add-nominal").value = "";
  });
}

function updateRow(id) {
  const flagaId = document.getElementById(`flaga-${id}`).value;
  const rok = document.getElementById(`rok-${id}`).value;
  const nrKat = encodeURIComponent(
    document.getElementById(`nrkat-${id}`).value.trim(),
  );
  const nominal = encodeURIComponent(
    document.getElementById(`nominal-${id}`).value.trim(),
  );
  const stopId = document.getElementById(`stop-${id}`).value;

  const params = `acc=update&id=${id}&flaga_id=${flagaId}&rok=${rok}&nr_kat=${nrKat}&nominal=${nominal}&stop_id=${stopId}`;

  request(params, function () {
    setMessage("Zapisano zmiany.");
    loadRows();
  });
}

function deleteRow(id) {
  if (!confirm("Na pewno usunąć rekord?")) {
    return;
  }

  request(`acc=delete&id=${id}`, function () {
    setMessage("Usunięto rekord.");
    loadRows();
  });
}

function init() {
  request("acc=getMeta", function (response) {
    meta.kraje = response.kraje || [];
    meta.stopy = response.stopy || [];
    renderAddRow();
    loadRows();
  });
}
