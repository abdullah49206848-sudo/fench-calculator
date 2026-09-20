/* =========================================
   FENCE CALCULATOR
   Calculator Logic
   ========================================= */

"use strict";


/* -----------------------------------------
   GET ELEMENTS
   ----------------------------------------- */

const fenceForm = document.getElementById("fenceForm");

const fenceLengthInput =
    document.getElementById("fenceLength");

const lengthUnit =
    document.getElementById("lengthUnit");

const fenceHeightInput =
    document.getElementById("fenceHeight");

const fenceTypeInput =
    document.getElementById("fenceType");

const postSpacingInput =
    document.getElementById("postSpacing");

const gatesInput =
    document.getElementById("gates");

const gateWidthInput =
    document.getElementById("gateWidth");

const picketWidthInput =
    document.getElementById("picketWidth");

const picketGapInput =
    document.getElementById("picketGap");

const railsInput =
    document.getElementById("rails");

const wasteInput =
    document.getElementById("waste");


/* -----------------------------------------
   RESULT ELEMENTS
   ----------------------------------------- */

const resultSections =
    document.getElementById("resultSections");

const resultPosts =
    document.getElementById("resultPosts");

const resultRails =
    document.getElementById("resultRails");

const resultPickets =
    document.getElementById("resultPickets");

const resultConcrete =
    document.getElementById("resultConcrete");

const resultWaste =
    document.getElementById("resultWaste");

const calculatorMessage =
    document.getElementById("calculatorMessage");

const currentYear =
    document.getElementById("currentYear");


/* -----------------------------------------
   HELPERS
   ----------------------------------------- */

function getNumber(element) {

    const value = Number(element.value);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return value;
}


function roundUp(value) {

    return Math.ceil(value);
}


function formatNumber(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits: 0
        }
    ).format(value);
}


function showError(message) {

    calculatorMessage.textContent = message;
}


function clearError() {

    calculatorMessage.textContent = "";
}


/* -----------------------------------------
   CALCULATE FENCE
   ----------------------------------------- */

function calculateFence() {

    clearError();


    /* INPUT VALUES */

    let fenceLength =
        getNumber(fenceLengthInput);

    const unit =
        lengthUnit.value;

    const fenceHeight =
        getNumber(fenceHeightInput);

    const postSpacing =
        getNumber(postSpacingInput);

    const gates =
        getNumber(gatesInput);

    const gateWidth =
        getNumber(gateWidthInput);

    const picketWidth =
        getNumber(picketWidthInput);

    const picketGap =
        getNumber(picketGapInput);

    const railsPerSection =
        getNumber(railsInput);

    const wastePercent =
        getNumber(wasteInput);


    /* VALIDATION */

    if (fenceLength <= 0) {

        showError(
            "Please enter a fence length greater than zero."
        );

        return;
    }


    if (fenceHeight <= 0) {

        showError(
            "Please enter a fence height greater than zero."
        );

        return;
    }


    if (postSpacing <= 0) {

        showError(
            "Post spacing must be greater than zero."
        );

        return;
    }


    if (gates < 0) {

        showError(
            "Number of gates cannot be negative."
        );

        return;
    }


    if (gateWidth < 0) {

        showError(
            "Gate width cannot be negative."
        );

        return;
    }


    if (picketWidth <= 0) {

        showError(
            "Picket width must be greater than zero."
        );

        return;
    }


    if (picketGap < 0) {

        showError(
            "Picket gap cannot be negative."
        );

        return;
    }


    if (railsPerSection <= 0) {

        showError(
            "Rails per section must be greater than zero."
        );

        return;
    }


    if (
        wastePercent < 0 ||
        wastePercent > 100
    ) {

        showError(
            "Waste allowance must be between 0% and 100%."
        );

        return;
    }


    /* -----------------------------------------
       CONVERT METERS TO FEET
       ----------------------------------------- */

    if (unit === "m") {

        fenceLength =
            fenceLength * 3.28084;
    }


    /* -----------------------------------------
       AVAILABLE FENCE LENGTH
       AFTER GATES
       ----------------------------------------- */

    const gateTotalWidth =
        gates * gateWidth;

    const usableFenceLength =
        Math.max(
            0,
            fenceLength - gateTotalWidth
        );


    /* -----------------------------------------
       FENCE SECTIONS
       ----------------------------------------- */

    const sections =
        Math.max(
            1,
            roundUp(
                usableFenceLength /
                postSpacing
            )
        );


    /* -----------------------------------------
       POSTS
       ----------------------------------------- */

    let posts =
        sections + 1;


    /*
       Gate openings normally require
       additional supporting posts.

       We add two support posts for
       each gate.
    */

    posts += gates * 2;


    /* -----------------------------------------
       RAILS
       ----------------------------------------- */

    const rails =
        sections * railsPerSection;


    /* -----------------------------------------
       PICKETS
       ----------------------------------------- */

    const picketSpacingInches =
        picketWidth + picketGap;

    const picketSpacingFeet =
        picketSpacingInches / 12;


    let pickets = 0;


    if (picketSpacingFeet > 0) {

        pickets =
            roundUp(
                usableFenceLength /
                picketSpacingFeet
            );
    }


    /* -----------------------------------------
       APPLY WASTE
       ----------------------------------------- */

    const wasteMultiplier =
        1 + (wastePercent / 100);


    const postsWithWaste =
        roundUp(
            posts * wasteMultiplier
        );


    const railsWithWaste =
        roundUp(
            rails * wasteMultiplier
        );


    const picketsWithWaste =
        roundUp(
            pickets * wasteMultiplier
        );


    /* -----------------------------------------
       CONCRETE ESTIMATE
       ----------------------------------------- */

    /*
       Approximate concrete volume.

       Assumption:
       12-inch diameter hole
       24-inch deep hole

       This is only an estimate.
    */

    const holeDiameterFeet =
        1;

    const holeDepthFeet =
        2;

    const radiusFeet =
        holeDiameterFeet / 2;


    const holeVolume =
        Math.PI *
        Math.pow(radiusFeet, 2) *
        holeDepthFeet;


    const totalConcreteCubicFeet =
        postsWithWaste *
        holeVolume;


    /*
       Approximate 80 lb concrete bag
       volume ≈ 0.6 cubic feet.
    */

    const concreteBagVolume =
        0.6;


    const concreteBags =
        roundUp(
            totalConcreteCubicFeet /
            concreteBagVolume
        );


    /* -----------------------------------------
       DISPLAY RESULTS
       ----------------------------------------- */

    resultSections.textContent =
        formatNumber(sections);


    resultPosts.textContent =
        formatNumber(postsWithWaste);


    resultRails.textContent =
        formatNumber(railsWithWaste);


    resultPickets.textContent =
        formatNumber(picketsWithWaste);


    resultConcrete.textContent =
        formatNumber(concreteBags) +
        " bags";


    resultWaste.textContent =
        wastePercent + "%";

}


/* -----------------------------------------
   FORM SUBMIT
   ----------------------------------------- */

fenceForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        calculateFence();

    }
);


/* -----------------------------------------
   LIVE UNIT CHANGE
   ----------------------------------------- */

lengthUnit.addEventListener(
    "change",
    function () {

        /*
         The calculator recalculates only
         after the user submits the form.
         This keeps unit conversion explicit.
        */

    }
);


/* -----------------------------------------
   CURRENT YEAR
   ----------------------------------------- */

currentYear.textContent =
    new Date().getFullYear();


/* -----------------------------------------
   INITIAL CALCULATION
   ----------------------------------------- */

calculateFence();
