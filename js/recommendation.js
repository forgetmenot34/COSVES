function generateRecommendation()
{
    let privacy = parseInt(document.getElementById("privacy").value);
    let accessibility = parseInt(document.getElementById("accessibility").value);
    let security = parseInt(document.getElementById("security").value);
    let scalability = parseInt(document.getElementById("scalability").value);

    let cloudScore = 0;
    let onPremiseScore = 0;

    // CLOUD ADVANTAGES
    cloudScore += accessibility;
    cloudScore += scalability;

    // ON-PREMISE ADVANTAGES
    onPremiseScore += privacy;
    onPremiseScore += security;

    let result = document.getElementById("result");
    let reason = document.getElementById("reason");

    if(onPremiseScore > cloudScore)
    {
        result.innerHTML = "On-Premise Storage";

        reason.innerHTML =
        "Recommended for organizations requiring stronger privacy protection, security control, and reduced external exposure.";
    }
    else
    {
        result.innerHTML = "Cloud Storage";

        reason.innerHTML =
        "Recommended for organizations prioritizing accessibility, scalability, and collaboration.";
    }
}