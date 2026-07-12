/**
 * chatbot.js
 * Simulated rule-based AI for Selection Eligibility
 */

const Chatbot = {
    isOpen: false,
    
    init() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatWindow = document.getElementById('chat-window');
        
        // Add initial greeting if empty
        if (this.chatMessages.children.length === 0) {
            this.addBotMessage("Hello! I am the AURA Dispatch AI Assistant. You can ask me questions about the eligibility rules for Delivery, Technical, Webcam, or Manager staff. How can I help you today?");
        }
    },

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.remove('hidden');
            setTimeout(() => this.chatWindow.classList.add('active'), 50);
            this.chatInput.focus();
        } else {
            this.chatWindow.classList.remove('active');
            setTimeout(() => this.chatWindow.classList.add('hidden'), 300);
        }
    },

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    },

    sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        // Add user message
        this.addUserMessage(text);
        this.chatInput.value = '';

        // Simulate thinking delay
        setTimeout(() => {
            this.processMessage(text.toLowerCase());
        }, 800);
    },

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user-message';
        msgDiv.innerText = text;
        this.chatMessages.appendChild(msgDiv);
        this.scrollToBottom();
    },

    addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot-message';
        msgDiv.innerHTML = text; // allow bold/links
        this.chatMessages.appendChild(msgDiv);
        this.scrollToBottom();
    },

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

    processMessage(msg) {
        let response = "";

        // Determine context
        const isAll = msg.includes('all') || msg.includes('every') || msg.includes('category') || msg.includes('categories');
        const isDelivery = msg.includes('delivery');
        const isTech = msg.includes('tech') || msg.includes('it');
        const isWebcam = msg.includes('webcam') || msg.includes('camera') || msg.includes('web');
        const isFinance = msg.includes('finance');
        const isAuditor = msg.includes('audit');
        const isOperations = msg.includes('operation');
        const isManager = msg.includes('manager') || isFinance || isAuditor || isOperations;

        const askingAge = msg.includes('age') || msg.includes('how old');
        const askingQual = msg.includes('qualif') || msg.includes('degree') || msg.includes('study') || msg.includes('education');
        const askingDoc = msg.includes('document') || msg.includes('proof') || msg.includes('id') || msg.includes('aadhaar');
        const askingSkill = msg.includes('skill') || msg.includes('experience') || msg.includes('know');
        const askingBenefit = msg.includes('benefit') || msg.includes('perk') || msg.includes('salary') || msg.includes('loan') || msg.includes('phone') || msg.includes('sim') || msg.includes('provide');

        // Logic routing
        if (askingBenefit) {
            if (isDelivery && !isAll) {
                response = "Benefits for Delivery Staff include: Guaranteed daily work, company bag & helmet, free 5G mobile phone, free Airtel 5G SIM card, and loan eligibility up to ₹1,00,000 based on Agency CIBIL Score.";
            } else if (isTech && !isAll) {
                response = "Benefits for Technical Staff include: Professional environment, skill development, free 5G calling + Wi-Fi tablet, free Airtel 5G SIM card, and loan eligibility up to ₹3,00,000.";
            } else if (isManager && !isAll) {
                response = "Manager Benefits include: Monthly salary up to ₹2,00,000, leadership role, official company laptop & phone, and loan eligibility up to ₹4,00,000 (No Agency CIBIL Score Required).";
            } else if (isWebcam && !isAll) {
                response = "Web Staff Benefits include: Fixed salary up to ₹30,000, company laptop & phone, professional training, and loan eligibility up to ₹4,00,000 (No Agency CIBIL Score Required).";
            } else {
                response = "Here are the benefits for our categories:<br><br><b>Delivery Staff:</b> Free 5G phone, Airtel 5G SIM, up to ₹1 Lakh loan.<br><b>Technical Staff:</b> Free 5G tablet, Airtel 5G SIM, up to ₹3 Lakh loan.<br><b>Managers:</b> Salary up to ₹2L, laptop/phone, up to ₹4 Lakh loan (No CIBIL).<br><b>Web Staff:</b> Fixed salary up to ₹30k, laptop/phone, up to ₹4 Lakh loan.";
            }
        }
        else if (isDelivery) {
            if (askingAge) response = "For **Delivery Staff**, the age requirement is 18 to 45 years. You must also be physically fit.";
            else if (askingQual) response = "You need a minimum 10th Pass (Matriculation) for Delivery Staff. 12th Pass is preferred.";
            else if (askingSkill) response = "You must have a Valid Two-Wheeler Driving License, good riding skills, and basic smartphone knowledge (GPS/Maps).";
            else response = "For **Delivery Staff**, you need to be 18-45 years old, 10th pass, and have a valid two-wheeler license. Do you want to know about documents or skills?";
        } 
        else if (isTech) {
            if (askingAge) response = "For **Technical Staff**, the age requirement is 18 to 55 years.";
            else if (askingQual) response = "You need a Computer Course/Diploma in CS/IT, or B.Tech/BCA/MCA. Final-year students can apply as interns.";
            else if (askingSkill) response = "You need hardware & troubleshooting skills, networking (Wi-Fi), and knowledge of Windows and mobile apps. Freshers are welcome.";
            else response = "For **Technical Staff**, we look for a background in CS/IT (Diploma/Degree) and troubleshooting skills. Age limit is 18-55.";
        }
        else if (isWebcam) {
            if (askingAge) response = "For **Webcam Staff**, the age limit is 18 to 55 years.";
            else if (askingQual) response = "A minimum of 12th Pass is required, but Graduates (BCA, B.Tech, BBA) are preferred.";
            else if (askingSkill) response = "You need basic computer proficiency, fast typing, ability to operate a webcam, and good communication skills.";
            else response = "For **Webcam Staff**, you need to be 18-55, 12th pass minimum, with fast typing and basic computer proficiency.";
        }
        else if (isManager) {
            if (isFinance) {
                if (askingQual) response = "Finance Managers need a Bachelor’s in Commerce/Finance. M.Com, MBA(Finance) or CA/CMA are preferred.";
                else if (askingSkill) response = "You need 2-5 years experience, advanced Excel, Tally ERP, and GST knowledge.";
                else response = "Finance Managers require a relevant Bachelor's degree and 2-5 years of experience in accounting/finance. Age limit is 21-55.";
            } else if (isAuditor) {
                if (askingQual) response = "Auditors need a Bachelor’s in Commerce/Finance. CA/CMA(Inter) preferred.";
                else response = "Auditors need a Finance/Commerce degree, 2-5 years of audit experience, and strong analytical skills. Age limit is 21-45.";
            } else if (isOperations) {
                if (askingQual) response = "Operations Managers need a Degree in Business, Logistics, or similar field.";
                else response = "Operations Managers need a degree in Business/Logistics and 2-5 years experience in operations/fleet management. Age limit is 21-45.";
            } else {
                response = "We have three Manager roles: Finance Manager, Auditor, and Operations Manager. Which one are you asking about?";
            }
        }
        else if (askingDoc) {
            response = "Common required documents across most roles include: Aadhaar Card, PAN Card, Educational Certificates, Passport-size Photograph, Bank Account Details, Mobile Number, and Address Proof.";
        }
        else if (askingAge) {
            response = "Age limits vary: Delivery (18-45), Technical/Webcam (18-55), Managers/Auditors generally (21-45 or 21-55). Which role are you interested in?";
        }
        else {
            response = "I can help you with eligibility rules and benefits! Please specify a role (e.g., 'Delivery Staff', 'Technical', 'Finance Manager') and what you want to know (like 'benefits', 'age', 'qualifications', or 'documents').";
        }

        this.addBotMessage(response);
    }
};

window.chatbot = Chatbot;
document.addEventListener('DOMContentLoaded', () => chatbot.init());
