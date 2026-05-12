const DATA_URL = "/assets/data/points-valuations.json";

const els = {
    form: document.getElementById("pointsCalculator"),
    status: document.getElementById("dataStatus"),
    selectProgram: document.getElementById("selectProgram"),
    pts: document.getElementById("ptsR"),
    cash: document.getElementById("cash"),
    fees: document.getElementById("fees"),
    userValuation: document.getElementById("userValuation"),
    customOverride: document.getElementById("customOveride"),
    valueIfPts: document.getElementById("ValueifPts"),
    valueIfPtsSpan: document.getElementById("ValueifPtsSpan"),
    valueReason: document.getElementById("ValueReason"),
    valueReasonSpan: document.getElementById("ValueReasonSPAN"),
    whoseVal: document.getElementById("whoseVal"),
    override: document.getElementById("override"),
    finalRec: document.getElementById("finalRec"),
    finalRec2: document.getElementById("finalRec_2"),
    newVal: document.getElementById("newVal"),
    initVal: document.getElementById("initVal"),
    updatedNote: document.getElementById("updatedNote")
};

let programsById = {};

function money(value) {
    return "$" + Math.round(value).toLocaleString("en-CA");
}

function roundedTenth(value) {
    return Math.round(value * 10) / 10;
}

function setStatus(message, type = "") {
    els.status.textContent = message;
    els.status.className = "status-banner";

    if (type) {
        els.status.classList.add(`is-${type}`);
    }
}

function groupPrograms(programs) {
    return programs.reduce((groups, program) => {
        const category = program.category || "Other";
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(program);
        return groups;
    }, {});
}

function optionLabel(program) {
    if (program.brand && program.name && program.brand !== program.name) {
        return `${program.name} (${program.brand})`;
    }

    return program.display_name || program.name || program.id;
}

function renderPrograms(programs) {
    els.selectProgram.innerHTML = '<option value="">- Select program -</option>';
    const grouped = groupPrograms(programs);

    Object.keys(grouped).forEach((category) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = category;

        grouped[category].forEach((program) => {
            const option = document.createElement("option");
            option.value = program.id;
            option.textContent = optionLabel(program);
            optgroup.appendChild(option);
        });

        els.selectProgram.appendChild(optgroup);
    });

    programsById = Object.fromEntries(programs.map((program) => [program.id, program]));
    els.selectProgram.disabled = false;
}

function showCustomValue() {
    els.customOverride.hidden = false;
    els.userValuation.focus();
}

function showResults(result) {
    els.finalRec.innerHTML = `RECOMMENDATION: <span class="mobile-only"><br></span><strong>USE ${result.whatToUse}</strong><br>${result.valueSaved}`;
    els.newVal.textContent = result.newVal;
    els.initVal.textContent = result.initVal;
    els.valueIfPtsSpan.textContent = money(result.ptsCashValue);
    els.valueReasonSpan.textContent = result.ptValue;
    els.whoseVal.innerHTML = result.usingCustomValue
        ? "your"
        : '<a href="https://flytrippers.com/how-much-are-points-worth-points-valuations-in-canada/">Flytrippers</a>';

    els.valueIfPts.hidden = false;
    els.valueReason.hidden = false;
    els.finalRec.hidden = false;
    els.finalRec2.hidden = false;
}

function hideResults() {
    els.valueIfPts.hidden = true;
    els.valueReason.hidden = true;
    els.finalRec.hidden = true;
    els.finalRec2.hidden = true;
}

function calculateValue() {
    const pts = Number(els.pts.value);
    const cash = Number(els.cash.value);
    const fees = Number(els.fees.value);
    const userValue = Number(els.userValuation.value);
    const selectedProgram = programsById[els.selectProgram.value];

    if (!selectedProgram || !pts || !cash) {
        hideResults();
        return;
    }

    const usingCustomValue = userValue > 0;
    const ptValue = usingCustomValue ? userValue : Number(selectedProgram.value_cents);
    const ptsCashValue = (ptValue / 100) * pts + fees;
    const cppWithFees = (ptsCashValue * 100) / pts;

    let whatToUse;
    let valueSaved;
    let newVal;

    if (cash < ptsCashValue) {
        whatToUse = "CASH";
        valueSaved = `(save ${money(ptsCashValue - cash)} worth of points)`;
        newVal = roundedTenth((cash * 100) / pts);
    } else if (cash > ptsCashValue) {
        whatToUse = "POINTS";
        valueSaved = `(save ${money(cash - ptsCashValue)})`;
        newVal = roundedTenth(cppWithFees);
    } else {
        whatToUse = "CASH or POINTS";
        valueSaved = "(same value here)";
        newVal = roundedTenth(cppWithFees);
    }

    showResults({
        whatToUse,
        valueSaved,
        newVal,
        initVal: roundedTenth(cppWithFees),
        ptsCashValue,
        ptValue,
        usingCustomValue
    });
}

function formatUpdatedNote(updatedAt) {
    if (!updatedAt) {
        return "";
    }

    const date = new Date(updatedAt.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) {
        return `Valuations last updated: ${updatedAt}`;
    }

    return `Valuations last updated: ${date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`;
}

async function loadValuations() {
    try {
        const response = await fetch(DATA_URL, { cache: "no-cache" });

        if (!response.ok) {
            throw new Error(`Valuation file returned ${response.status}`);
        }

        const data = await response.json();
        const programs = Array.isArray(data.programs) ? data.programs : [];

        if (!programs.length) {
            throw new Error("Valuation file has no programs");
        }

        renderPrograms(programs);
        els.updatedNote.textContent = formatUpdatedNote(data.updated_at);
        setStatus("Current Canadian point valuations loaded.", "ready");
    } catch (error) {
        console.error(error);
        els.selectProgram.disabled = true;
        els.form.querySelector(".calculate-button").disabled = true;
        setStatus("Point valuations are temporarily unavailable. Please try again later.", "error");
    }
}

["change", "input"].forEach((eventName) => {
    els.form.addEventListener(eventName, calculateValue);
});

els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateValue();
});

els.override.addEventListener("click", showCustomValue);

loadValuations();
