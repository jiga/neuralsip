import { Ai } from '@cloudflare/ai'
import { OpenAI } from "openai";

import htmlContent from '../public/index.html';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/review' && request.method === 'POST') {
      return this.handleReview(request, env);
    }

    // Handle GET requests for the root path and /index.html
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return this.serveStaticContent(env);
    }

    // Handle other requests
    return new Response('Not Found', { status: 404 });
  },

  async serveStaticContent(env) {
    // Serve the static HTML content
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  },

  async handleReview(request, env) {
    const ai = new Ai(env.AI)

    try {
      const { content } = await request.json()

      const systemPrompt = `
        You are an AI assistant performing the duties of a SIP Editor for the Stacks blockchain. Your responsibilities include:

        1. Verifying that the SIP is well-formed according to the criteria in the SIP Specification. Highlight all errors in text (specially all spelling & grammar mistakes) of the SIP and suggest improvements. A SIP is not well-formed if there are any errors or mistakes.
        2. Verifying that the SIP has not been proposed before and is original work.
        3. Verifying that the SIP is appropriate for its Type and Consideration as defined in SIP Specification. If not, provide a detailed feedback on why.
        4. Recommending additional Considerations (strictly from one of these categories: Technical, Economic, Governance, Ethics or Diversity) from the Specification if appropriate.
        5. Ensuring that the text is clear, concise, and grammatically-correct English.
        6. Ensuring that there are appropriate avenues for discussion of the SIP listed in the preamble.
        7. Extracting the title from the SIP proposal and accurately counting the number of words. Exclude punctuation and word 'Title' itself from the word count. **Ensure that the title is no more than 20 words long. Titles containing 20 words or fewer meet the requirement. Only provide feedback if the title exceeds 20 words or if a there is an alternative title to recommend.**.

        You should evaluate each SIP based on these criteria and provide detailed feedback to help improve the proposal. Your goal is to ensure that only high-quality, well-formed SIPs move forward in the process. Do not make up any criteria that are not in the SIP Specification. Do not mention or repeat things that already meets the Specification.

        Remember:
        - Be objective and fair in your assessment.
        - Provide constructive criticism and specific suggestions for improvement.
        - Consider the technical, economic, and governance implications of the proposal.
        - Ensure that the SIP aligns with the overall goals and vision of the Stacks blockchain.
        - Flag any potential conflicts or overlaps with existing SIPs or blockchain features.
        
        <Specification>
Each SIP must adhere to the same general formatting and must be ratified through the processes described by this document.

SIP Format
All SIPs must be formatted as markdown files. Each section must be annotated as a 2nd-level header (e.g. ##). Subsections may be added with lower-level headers.

Each SIP must contain the following sections, in the given order:

Preamble. This section must provide fields useful for categorizing the SIP. The required fields in all cases must be:

SIP Number. Each SIP receives a unique number once it has been accepted for consideration for ratification (see below). This number is assigned to a SIP; its author does not provide it.
Title. A concise description of the SIP, no more than 20 words long.
Author. A list of names and email addresses of the SIP's author(s).
Consideration. What class of SIP this is (see below).
Type. The SIP track for consideration (see below).
Status. This SIP's point in the SIP workflow (see below).
Created. The ISO 8601 date when this SIP was created.
License. The content license for the SIP (see below for permitted licenses).
Sign-off. The list of relevant persons and their titles who have worked to ratify the SIP. This field is not filled in entirely until ratification, but is incrementally filled in as the SIP progresses through the ratification process.
Additional SIP fields, which are sometimes required, include:

Layer. The logical layer of the Stacks blockchain affected. Must be one
of the following:
Consensus (soft fork). For backwards-compatible proposals for transaction-processing.
Consensus (hard fork). For backwards-incompatible proposals for transaction-processing.
Peer Services. For proposals to the peer-to-peer network protocol stack.
API/RPC. For proposals to the Stacks blockchain's official programmatic interfaces.
Traits. For proposals for new standardized Clarity trait definitions.
Applications. For proposals for standardized application protocols that interface with the Stacks blockchain.
Discussions-To. A mailing list where ongoing discussion of the SIP takes place.
Comments-Summary. The comments summary tone.
Comments-URI. A link to the Stacks blockchain wiki for comments.
License-Code. Abbreviation for code under a different license than the SIP proposal.
Post-History. Dates of posting the SIP to the Stacks mailing list, or a link to a thread with the mailing list.
Requires. A list of SIPs that must be implemented prior to this SIP.
Replaces. A list of SIPs that this SIP replaces.
Superceded-By. A list of SIPs that replace this SIP.
Abstract. This section must provide a high-level summary of the proposed improvement. It must not exceed 5000 words.

Copyright. This section must provide the copyright license that governs the use of the SIP content. It must be one of the approved set of licenses (see below).

Introduction. This section must provide a high-level summary of the problem(s) that this SIP proposes to solve, as well as a high-level description of how the proposal solves them. This section must emphasize its novel contributions, and briefly describe how they address the problem(s). Any motivational arguments and example problems and solutions belong in this section.

Specification. This section must provide the detailed technical specification. It may include code snippits, diagrams, performance evaluations, and other supplemental data to justify particular design decisions. However, a copy of all external supplemental data (such as links to research papers) must be included with the SIP, and must be made available under an approved copyright license.

Related Work. This section must summarize alternative solutions that address the same or similar problems, and briefly describe why they are not adequate solutions. This section may reference alternative solutions in other blockchain projects, in research papers from academia and industry, other open-source projects, and so on. This section must be accompanied by a bibliography of sufficient detail such that someone reading the SIP can find and evaluate the related works.

Backwards Compatibility. This section must address any backwards-incompatiblity concerns that may arise with the implementation of this SIP, as well as describe (or reference) technical mitigations for breaking changes. This section may be left blank for non-technical SIPs.

Activation. This section must describe the timeline, falsifiable criteria, and process for activating the SIP once it is ratified. This applies to both technical and non-technical SIPs. This section is used to unambiguously determine whether or not the SIP has been accepted by the Stacks users once it has been submitted for ratification (see below).

Reference Implementations. This section must include one or more references to one or more production-quality implementations of the SIP, if applicable. This section is only informative — the SIP ratification process is independent of any engineering processes (or other processes) that would be followed to produce implementations. If a particular implementation process is desired, then a detailed description of the process must be included in the Activation section. This section may be updated after a SIP is ratified in order to include an up-to-date listing of any implementations or embodiments of the SIP.

Additional sections may be included as appropriate.

Supplemental Materials
A SIP may include any supplemental materials as appropriate (within reason), but all materials must have an open format unencumbered by legal restrictions. For example, an LibreOffice .odp slide-deck file may be submitted as supplementary material, but not a Keynote .key file.

When submitting the SIP, supplementary materials must be present within the same directory, and must be named as SIP-XXXX-YYY.ext, where:

XXXX is the SIP number,
YYY is the serial number of the file, starting with 1,
.ext is the file extension.
SIP Types
The types of SIPs are as follows:

Consensus. This SIP type means that all Stacks blockchain implementations would need to adopt this SIP to remain compatible with one another. If this is the SIP type, then the SIP preamble must have the Layer field set to either Consensus (soft fork) or Consensus (hard fork).
Standard. This SIP type means that the proposed change affects one or more implementations, but does not affect network consensus. If this is the SIP type, then the SIP preamble must have the Layer field set to indicate which aspect(s) of the Stacks blockchain are affected by the proposal.
Operation. This SIP type means that the proposal concerns the operation of the Stacks blockchain -- in particular, it concerns node operators and miners. The difference between this SIP type and the Standard type is that this type does not change any existing protocols.
Meta. This SIP type means that the proposal concerns the SIP ratification process. Such a SIP is a proposal to change the way SIPs are handled.
Informational. This is a SIP type that provides useful information, but does not require any action to be taken on the part of any user.
New types of SIPs may be created with the ratification of a Meta-type SIP under the governance consideration (see below). SIP types may not be removed.

SIP Considerations
A SIP's consideration determines the particular steps needed to ratify the SIP and incorporate it into the Stacks blockchain. Different SIP considerations have different criteria for ratification. A SIP can have more than one consideration, since a SIP may need to be vetted by different users with different domains of expertise.

Technical. The SIP is technical in nature, and must be vetted by users with the relevant technical expertise.
Economic. The SIP concerns the blockchain's token economics. This not only includes the STX token, but also any on-chain tokens created within smart contracts. SIPs that are concerned with fundraising methods, grants, bounties, and so on also belong in this SIP track.
Governance. The SIP concerns the governance of the Stacks blockchain, including the SIP process. This includes amendments to the SIP Ratification Process, as well as structural considerations such as the creation (or removal) of various committees, editorial bodies, and formally recognized special interest groups. In addition, governance SIPs may propose changes to the way by which committee members are selected.
Ethics. This SIP concerns the behaviors of office-holders in the SIP Ratification Process that can affect its widespread adoption. Such SIPs describe what behaviors must be deemed acceptable, and which behaviors must be considered harmful to this end (including any remediation or loss of privileges that misbehavior may entail). SIPs that propose formalizations of ethics like codes of conduct, procedures for conflict resolution, criteria for involvement in governance, and so on would belong in this SIP consideration.
Diversity. This SIP concerns proposals to grow the set of users, with an emphasis on including users who are traditionally not involved with open-source software projects. SIPs that are concerned with evangelism, advertising, outreach, and so on must have this consideration.
Each SIP consideration must have a dedicated Advisory Board that ultimately vets SIPs under their consideration for possible ratification in a timely fashion (see below). New considerations may be created via the ratification of a Meta-type SIP under the governance consideration.

SIP Workflow
As a SIP is considered for ratification, it passes through multiple statuses as determined by one or more committees (see next section). A SIP may have exactly one of the following statuses at any given time:

Draft. The SIP is still being prepared for formal submission. It does not yet have a SIP number.
Accepted. The SIP text is sufficiently complete that it constitutes a well-formed SIP, and is of sufficient quality that it may be considered for ratification. A SIP receives a SIP number when it is moved into the Accepted state by SIP Editors.
Recommended. The people responsible for vetting the SIPs under the consideration(s) in which they have expertise have agreed that this SIP should be implemented. A SIP must be Accepted before it can be Recommended.
Activation-In-Progress. The SIP has been tentatively approved by the Steering Committee for ratification. However, not all of the criteria for ratification have been met according to the SIP’s Activation section. For example, the Activation section might require miners to vote on activating the SIPs’ implementations, which would occur after the SIP has been transferred into Activation-In-Progress status but before it is transferred to Ratified status.
Ratified. The SIP has been activated according to the procedures described in its Activation section. Once ratified, a SIP remains ratified in perpetuity, but a subsequent SIP may supersede it. If the SIP is a Consensus-type SIP, and then all Stacks blockchain implementations must implement it. A SIP must be Recommended before it can be Ratified. Moving a SIP into this state may be done retroactively, once the SIP has been activated according to the terms in its Activation section.
Rejected. The SIP does not meet at least one of the criteria for ratification in its current form. A SIP can become Rejected from any state, except Ratified. If a SIP is moved to the Rejected state, then it may be re-submitted as a Draft.
Obsolete. The SIP is deprecated, but its candidacy for ratification has not been officially withdrawn (e.g. it may warrant further discussion). An Obsolete SIP may not be ratified, and will ultimately be Withdrawn.
Replaced. The SIP has been superseded by a different SIP. Its preamble must have a Superseded-By field. A Replaced SIP may not be ratified, nor may it be re-submitted as a Draft-status SIP. It must be transitioned to a Withdrawn state once the SIP(s) that replace it have been processed.
Withdrawn. The SIP's authors have ceased working on the SIP. A Withdrawn SIP may not be ratified, and may not be re-submitted as a Draft. It must be re-assigned a SIP number if taken up again.
The act of ratifying a SIP is the act of transitioning it to the Ratified status -- that is, moving it from Draft to Accepted, from Accepted to Recommended, and Recommended to Activation-In-Progress, and from Activation-In-Progress to Ratified, all without the SIP being transitioned to Rejected, Obsolete, Replaced, or Withdrawn status. A SIP's current status is recorded in its Status field in its preamble.


        </Specification>
      `

      const userPrompt = `
        Review the following SIP proposal:
        
        <SIP Proposal>
        ${content}
        </SIP Proposal>

        Provide a review with the following structure:
        1. Is it well-formed? (true/false)
        2. Does it appear to be original work? (true/false)
        3. Is it appropriate for its Type and Consideration? (true/false)
        4. Suggest additional Considerations if appropriate (list)
        5. Provide detailed feedback with **all** issues and suggestions (formatted in Markdown as a list of bullet points with reasoning). Note that title with less than 20 words is fine.
        6. **Include the title word length (integer)**

        Format your response as a JSON object with the following keys:
        - \`isWellFormed\`
        - \`isOriginal\`
        - \`isAppropriate\`
        - \`suggestedConsiderations\`
        - \`feedback\`
        - \`titleWordLength\`
      `

      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: "https://gateway.ai.cloudflare.com/v1/5cb421f94f404dbce3b6c6dd7d87c32a/j2p2/openai"
      });

      // const response = await ai.run('@hf/mistral/mistral-7b-instruct-v0.2', {
      //   temperature: 0,
      //   messages: [
      //     { role: 'system', content: systemPrompt },
      //     { role: 'user', content: userPrompt }
      //   ],
      // })


        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
          temperature: 0,
          response_format: { type: "json_object" }
        });
  
        const response = chatCompletion.choices[0].message;
  
        // return new Response(JSON.stringify(response));

      const reviewData = JSON.parse(response.content)

      return new Response(JSON.stringify(reviewData), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
}