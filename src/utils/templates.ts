import type { TemplateDef } from "../types";

/**
 * Ready-made templates for documents Indian users create most often.
 * Content is provided as editor HTML.
 */
export const TEMPLATES: TemplateDef[] = [
  {
    id: "blank",
    title: "Blank document",
    description: "Start from a clean page",
    icon: "FilePlus",
    category: "Basic",
    content: "<p></p>",
  },
  {
    id: "leave-app",
    title: "Leave Application (सिविल/सरकारी)",
    description: "Formal leave application to an office",
    icon: "FileText",
    category: "Official",
    content: `
<p>To,</p>
<p>The Manager,</p>
<p>[Organisation / Office Name]</p>
<p>[Address Line]</p>
<p>City, PIN — 000 000</p>
<p><br></p>
<p><b>Subject:</b> Application for leave from [start date] to [end date]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I wish to request you to kindly grant me leave for a period of <b>[number]</b> days, from <b>[start date]</b> to <b>[end date]</b> (both days inclusive), due to [reason for leave].</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I have completed all my pending work and have briefed my colleague [name] to handle urgent matters in my absence. My leave balance is sufficient to cover this period.</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Kindly approve my leave application. I shall resume duty on <b>[return date]</b>.</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours faithfully,</p>
<p>[Your Name]</p>
<p>Designation: [Designation]</p>
<p>Employee / Register No.: [ID]</p>
<p>Date: [DD/MM/YYYY]</p>
`.trim(),
  },
  {
    id: "affidavit",
    title: "Affidavit (शपथ पत्र)",
    description: "Notarised affidavit format",
    icon: "ScrollText",
    category: "Legal",
    content: `
<p><b>AFFIDAVIT</b></p>
<p><br></p>
<p>I, <b>[Full Name]</b>, aged about <b>[age]</b> years, son/daughter/wife of <b>[Father/Spouse Name]</b>, resident of <b>[Full Address]</b>, do hereby solemnly affirm and state on oath as under:</p>
<p><br></p>
<p>1. That I am the deponent and I am well conversant with the facts and circumstances of this case and as such I am competent to file this affidavit.</p>
<p>2. That the details mentioned in the accompanying application/document are true and correct to the best of my knowledge and belief.</p>
<p>3. That no part of the said information is false or has been concealed.</p>
<p><br></p>
<p>I further state that this affidavit is being filed for the purpose of [purpose] and nothing stated herein is false.</p>
<p><br></p>
<p><b>VERIFICATION</b></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.</p>
<p><br></p>
<p>Verified at [City] on this [day] day of [month], [year].</p>
<p><br></p>
<p style="text-align:right"><b>DEPONENT</b></p>
<p><br></p>
<p style="text-align:center">Before me,</p>
<p style="text-align:center">[Notary / Oath Commissioner]</p>
`.trim(),
  },
  {
    id: "rent-agreement",
    title: "Rent Agreement (किराया समझौता)",
    description: "Simple residential rent agreement",
    icon: "FileSignature",
    category: "Legal",
    content: `
<p><b>RESIDENTIAL RENT AGREEMENT</b></p>
<p><br></p>
<p>This Rent Agreement is made and entered into at [City] on this <b>[day]</b> day of <b>[month]</b>, <b>[year]</b>, between:</p>
<p><br></p>
<p><b>LANDLORD:</b> [Landlord Name], son/wife of [Name], resident of [Address] (hereinafter referred to as the "Landlord", which expression shall mean and include his heirs and legal representatives);</p>
<p><br></p>
<p>AND</p>
<p><br></p>
<p><b>TENANT:</b> [Tenant Name], son/wife of [Name], resident of [Address] (hereinafter referred to as the "Tenant", which expression shall mean and include his heirs and legal representatives).</p>
<p><br></p>
<p><b>WHEREAS</b> the Landlord is the absolute owner of the property bearing address <b>[Property Address]</b> (hereinafter called the "Premises").</p>
<p><br></p>
<p>Now this agreement witnesseth as follows:</p>
<p>1. The Landlord lets out the Premises to the Tenant on a monthly rent of <b>₹ [Rent]</b> (Rupees [Rent in words] only).</p>
<p>2. The Tenant has paid an interest-free refundable security deposit of <b>₹ [Deposit]</b> to the Landlord, which shall be refunded at the time of vacating the Premises, subject to no dues.</p>
<p>3. The rent shall be payable on or before the [day] day of each English calendar month.</p>
<p>4. This agreement shall be for a period of <b>[11 months]</b>, renewable with mutual consent.</p>
<p>5. The Tenant shall not sublet the Premises or use it for any illegal purpose.</p>
<p><br></p>
<p>IN WITNESS WHEREOF, the parties hereto have signed this agreement on the day and year first above written.</p>
<p><br></p>
<p style="text-align:right"><b>LANDLORD</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>TENANT</b></p>
<p style="text-align:center"><i>Witnesses:</i></p>
<p style="text-align:center">1. [Witness Name]&nbsp;&nbsp;&nbsp;&nbsp;2. [Witness Name]</p>
`.trim(),
  },
  {
    id: "adhaar-correction",
    title: "Aadhaar Correction Form",
    description: "Request to update Aadhaar details",
    icon: "IdCard",
    category: "Official",
    content: `
<p><b>APPLICATION FOR UPDATE / CORRECTION OF AADHAAR DETAILS</b></p>
<p><br></p>
<p>To,</p>
<p>The Manager,</p>
<p>[UIDAI / Aadhaar Seva Kendra]</p>
<p>[City]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I, <b>[Name]</b>, holding Aadhaar Number <b>[XXXX XXXX XXXX]</b>, resident of <b>[Address]</b>, hereby request to update the following detail(s) in my Aadhaar record:</p>
<p><br></p>
<p><b>Details to be corrected/updated:</b></p>
<p>1. Name: From [old] to [new]</p>
<p>2. Date of Birth: From [old] to [new]</p>
<p>3. Address: From [old] to [new]</p>
<p>4. Mobile Number: From [old] to [new]</p>
<p>5. Gender: From [old] to [new]</p>
<p><br></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;Supporting documents for the requested changes are enclosed. I request you to process my application and issue the updated Aadhaar at the earliest.</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours faithfully,</p>
<p>[Signature]</p>
<p>[Name]</p>
<p>Mobile: [XXXXXXXXXX]</p>
<p>Email: [email]</p>
<p>Date: [DD/MM/YYYY]</p>
`.trim(),
  },
  {
    id: "pan-application",
    title: "PAN Card Application",
    description: "Request for Permanent Account Number",
    icon: "CreditCard",
    category: "Official",
    content: `
<p><b>APPLICATION FOR PERMANENT ACCOUNT NUMBER (PAN)</b></p>
<p><br></p>
<p>To,</p>
<p>The Tax Department,</p>
<p>NSDL / UTIITSL,</p>
<p>[Address]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I, <b>[Applicant Name]</b>, son/daughter/wife of <b>[Father Name]</b>, born on <b>[DD/MM/YYYY]</b>, resident of <b>[Address]</b>, hereby request you to issue me a Permanent Account Number (PAN) Card.</p>
<p><br></p>
<p>My particulars are as follows:</p>
<p>1. Full Name: [Name]</p>
<p>2. Date of Birth: [DD/MM/YYYY]</p>
<p>3. Aadhaar Number: [XXXXXXXXXXXX]</p>
<p>4. Mobile Number: [XXXXXXXXXX]</p>
<p>5. Email: [email]</p>
<p>6. Address: [Address]</p>
<p>7. Source of Income: [Salary / Business / Other]</p>
<p><br></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;The necessary documents and proof of identity, address and date of birth are enclosed herewith. Kindly process my application and issue the PAN card to the address mentioned above.</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours faithfully,</p>
<p>[Signature]</p>
<p>[Name]</p>
<p>Date: [DD/MM/YYYY]</p>
`.trim(),
  },
  {
    id: "fir-complaint",
    title: "Police Complaint (प्राथमिकी)",
    description: "Written complaint to the police",
    icon: "ShieldAlert",
    category: "Official",
    content: `
<p><b>WRITTEN COMPLAINT TO THE POLICE</b></p>
<p><br></p>
<p>To,</p>
<p>The Station House Officer (SHO),</p>
<p>[Police Station Name],</p>
<p>[City / District]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p><b>Subject:</b> Complaint regarding [brief description of incident]</p>
<p><br></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I, <b>[Complainant Name]</b>, aged <b>[age]</b> years, son/daughter/wife of <b>[Father Name]</b>, resident of <b>[Full Address]</b>, wish to lodge a complaint against <b>[Accused Name / Description]</b> regarding the following incident:</p>
<p><br></p>
<p><b>Details of the incident:</b></p>
<p>Date and time: [DD/MM/YYYY] at [HH:MM]</p>
<p>Place: [Location]</p>
<p>Description: [Full description of what happened, persons involved, property lost, etc.]</p>
<p>Value of property / amount involved: ₹ [Amount]</p>
<p><br></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I therefore request you to kindly register my complaint and take appropriate legal action against the accused and recover my [property / amount]. I shall extend full co-operation in the investigation.</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours faithfully,</p>
<p>[Signature]</p>
<p>[Name]</p>
<p>Mobile: [XXXXXXXXXX]</p>
<p>Date: [DD/MM/YYYY]</p>
`.trim(),
  },
  {
    id: "invoice",
    title: "Invoice / Bill (चालान)",
    description: "Simple invoice with GST column",
    icon: "Receipt",
    category: "Business",
    content: `
<p style="text-align:center"><b>[Your Business / Shop Name]</b></p>
<p style="text-align:center">[Address, City, State, PIN]</p>
<p style="text-align:center">GSTIN: [GST Number] &nbsp;|&nbsp; Phone: [XXXX]</p>
<p><br></p>
<p><b>TAX INVOICE</b></p>
<p><br></p>
<table>
  <tbody>
    <tr><th>Invoice No.</th><td>[INV-0001]</td><th>Date</th><td>[DD/MM/YYYY]</td></tr>
    <tr><th>Buyer</th><td colspan="3">[Customer Name & Address]</td></tr>
  </tbody>
</table>
<p><br></p>
<table>
  <tbody>
    <tr><th style="width:40px">S.No</th><th>Item Description</th><th style="width:80px">Qty</th><th style="width:90px">Rate (₹)</th><th style="width:110px">Amount (₹)</th></tr>
    <tr><td>1</td><td>[Item name]</td><td>1</td><td>[Rate]</td><td>[Amount]</td></tr>
    <tr><td>2</td><td>[Item name]</td><td>1</td><td>[Rate]</td><td>[Amount]</td></tr>
    <tr><td></td><td style="text-align:right"><b>Total (without GST)</b></td><td></td><td></td><td><b>[Total]</b></td></tr>
    <tr><td></td><td style="text-align:right">CGST (9%)</td><td></td><td></td><td>[CGST]</td></tr>
    <tr><td></td><td style="text-align:right">SGST (9%)</td><td></td><td></td><td>[SGST]</td></tr>
    <tr><td></td><td style="text-align:right"><b>Grand Total</b></td><td></td><td></td><td><b>[Grand Total]</b></td></tr>
  </tbody>
</table>
<p><br></p>
<p>Amount in words: Rupees <b>[Amount in words]</b> only.</p>
<p><br></p>
<p style="text-align:right">For [Business Name],</p>
<p style="text-align:right"><i>[Authorised Signatory]</i></p>
<p>Bank Details: Account Name, Account No., IFSC, Branch.</p>
`.trim(),
  },
  {
    id: "resume",
    title: "Resume / CV (बायोडाटा)",
    description: "Professional resume template",
    icon: "User",
    category: "Career",
    content: `
<p style="text-align:center"><b>[YOUR FULL NAME]</b></p>
<p style="text-align:center">[City, State, PIN] • [Mobile Number] • [Email]</p>
<p style="text-align:center">LinkedIn: [link]</p>
<p><br></p>
<p><b>CAREER OBJECTIVE</b></p>
<p>Seeking a challenging position at [Company] where I can apply my skills in [field] and contribute to the growth of the organisation.</p>
<p><br></p>
<p><b>EDUCATION</b></p>
<p>• <b>[Degree]</b>, [University], [Year] — [CGPA/Percentage]</p>
<p>• <b>[Class XII]</b>, [Board], [Year] — [Percentage]</p>
<p>• <b>[Class X]</b>, [Board], [Year] — [Percentage]</p>
<p><br></p>
<p><b>WORK EXPERIENCE</b></p>
<p>• <b>[Job Title]</b>, [Company], [From–To]</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;• Key responsibility / achievement</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;• Key responsibility / achievement</p>
<p><br></p>
<p><b>SKILLS</b></p>
<p>• Technical: [Skills]</p>
<p>• Soft: [Skills]</p>
<p>• Languages: Hindi, English, [Other]</p>
<p><br></p>
<p><b>CERTIFICATIONS / AWARDS</b></p>
<p>• [Certification], [Year]</p>
<p><br></p>
<p><b>DECLARATION</b></p>
<p>I hereby declare that the above information is true to the best of my knowledge.</p>
<p style="text-align:right">[Signature]</p>
<p style="text-align:right">[Name]</p>
`.trim(),
  },
  {
    id: "shraddhanjali",
    title: "Letter of Undertaking",
    description: "Standard undertaking/declaration letter",
    icon: "FileCheck",
    category: "Official",
    content: `
<p><b>LETTER OF UNDERTAKING</b></p>
<p><br></p>
<p>To,</p>
<p>The [Authority / Officer],</p>
<p>[Organisation],</p>
<p>[Address]</p>
<p><br></p>
<p>Subject: Undertaking regarding [purpose]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I, <b>[Name]</b>, son/daughter/wife of <b>[Father Name]</b>, holder of [ID document] bearing number <b>[Number]</b>, resident of <b>[Address]</b>, do hereby undertake and declare that:</p>
<p><br></p>
<p>1. I shall abide by all the terms and conditions laid down by your office.</p>
<p>2. All the information furnished by me is true and correct.</p>
<p>3. I shall be responsible for any loss or damage caused due to my actions.</p>
<p><br></p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;I further undertake to indemnify your office against any claim arising out of the above. This undertaking shall remain in force until [date / completion of purpose].</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours faithfully,</p>
<p>[Signature]</p>
<p>[Name]</p>
<p>Mobile: [XXXXXXXXXX]</p>
<p>Date: [DD/MM/YYYY]</p>
`.trim(),
  },
  {
    id: "kavita",
    title: "Hindi Letter (हिंदी पत्र)",
    description: "Formal letter in Hindi",
    icon: "Languages",
    category: "Hindi",
    content: `
<p style="text-align:right"><b>सेवा में,</b></p>
<p><b>श्रीमान प्रबंधक महोदय,</b></p>
<p>[संस्थान का नाम]</p>
<p>[पता]</p>
<p><br></p>
<p><b>विषय:</b> [विषय का विवरण] हेतु प्रार्थना पत्र</p>
<p><br></p>
<p>महोदय,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;मैं [आपका नाम], [पद/विभाग], निवासी [पूरा पता] आपका निवेदन करता/करती हूँ कि [विषय का पूरा विवरण]।</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;अतः आपसे विनम्र निवेदन है कि [जो करने का अनुरोध] कृपया करें। मैं आपकी अत्यंत आभारी रहूँगा/रहूँगी।</p>
<p><br></p>
<p>धन्यवाद सहित,</p>
<p><br></p>
<p>भवदीय,</p>
<p>[हस्ताक्षर]</p>
<p>[आपका नाम]</p>
<p>दिनांक: [दिन/महीना/वर्ष]</p>
`.trim(),
  },
  {
    id: "letterhead",
    title: "Formal Letterhead",
    description: "Blank formal letter with letterhead",
    icon: "Mail",
    category: "Basic",
    content: `
<p style="text-align:center"><b>[COMPANY / OFFICE NAME]</b></p>
<p style="text-align:center">[Address, City, State, PIN] • [Phone] • [Email] • [Website]</p>
<p style="text-align:center"><i>GSTIN: [Number]</i></p>
<hr>
<p><br></p>
<p>Date: [DD/MM/YYYY]</p>
<p><br></p>
<p>To,</p>
<p>[Recipient Name],</p>
<p>[Organisation],</p>
<p>[Address]</p>
<p><br></p>
<p><b>Subject:</b> [Subject]</p>
<p><br></p>
<p>Respected Sir/Madam,</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;[Body of the letter]</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;[Body of the letter]</p>
<p><br></p>
<p>Thanking you,</p>
<p><br></p>
<p>Yours sincerely,</p>
<p>[Signature]</p>
<p>[Name]</p>
<p>[Designation]</p>
`.trim(),
  },
];
