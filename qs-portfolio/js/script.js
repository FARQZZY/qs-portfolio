document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Toggle
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
        });
    }

    // 2. Quantity Surveying Milestone & Cost Planner (Runs on planner.html)
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("categorySelect");
    const costInput = document.getElementById("costInput");
    const taskList = document.getElementById("taskList");
    const totalTasksEl = document.getElementById("totalTasks");
    const completedTasksEl = document.getElementById("completedTasks");
    const totalBudgetEl = document.getElementById("totalBudget");

    if (taskForm && taskList) {
        let milestones = JSON.parse(localStorage.getItem("qsMilestones")) || [
            { id: 1, text: "Substructure Inspection at Monumental Stone", category: "Site Supervision", cost: 18500000, completed: true },
            { id: 2, text: "OYSROMA Road Maintenance Coordination", category: "Infrastructure", cost: 65000000, completed: false },
            { id: 3, text: "COS 106 GitHub Web Portfolio Deployment", category: "Web Development", cost: 12400000, completed: false }
        ];

        function saveAndRender() {
            localStorage.setItem("qsMilestones", JSON.stringify(milestones));
            renderMilestones();
        }

        function formatNaira(amount) {
            return "₦" + Number(amount || 0).toLocaleString("en-NG");
        }

        function renderMilestones() {
            taskList.innerHTML = "";

            milestones.forEach((item) => {
                const li = document.createElement("li");
                li.className = `task-item ${item.completed ? "completed" : ""}`;

                li.innerHTML = `
                    <div class="task-info">
                        <input type="checkbox" ${item.completed ? "checked" : ""} aria-label="Mark milestone complete">
                        <span class="course-tag">${escapeHTML(item.category)}</span>
                        <span class="task-text">${escapeHTML(item.text)}</span>
                        <span class="cost-badge">${formatNaira(item.cost)}</span>
                    </div>
                    <button class="delete-btn" aria-label="Delete milestone">Delete</button>
                `;

                const checkbox = li.querySelector("input[type='checkbox']");
                checkbox.addEventListener("change", () => toggleMilestone(item.id));

                const deleteBtn = li.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", () => deleteMilestone(item.id));

                taskList.appendChild(li);
            });

            const completedCount = milestones.filter((m) => m.completed).length;
            const totalEstimatedCost = milestones.reduce((sum, m) => sum + Number(m.cost || 0), 0);

            totalTasksEl.textContent = `Milestones: ${milestones.length}`;
            completedTasksEl.textContent = `Completed: ${completedCount}`;
            totalBudgetEl.textContent = `Total Est. Value: ${formatNaira(totalEstimatedCost)}`;
        }

        function addMilestone(text, category, cost) {
            const newMilestone = {
                id: Date.now(),
                text: text.trim(),
                category: category,
                cost: Number(cost) || 0,
                completed: false
            };
            milestones.push(newMilestone);
            saveAndRender();
        }

        function toggleMilestone(id) {
            milestones = milestones.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            );
            saveAndRender();
        }

        function deleteMilestone(id) {
            milestones = milestones.filter((item) => item.id !== id);
            saveAndRender();
        }

        function escapeHTML(str) {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        }

        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (taskInput.value.trim() !== "") {
                addMilestone(taskInput.value, categorySelect.value, costInput.value);
                taskInput.value = "";
                costInput.value = "";
            }
        });

        renderMilestones();
    }

    // 3. Contact Form Validation (Runs on contact.html)
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const phoneError = document.getElementById("phoneError");
            const messageError = document.getElementById("messageError");
            const successBanner = document.getElementById("formSuccess");

            // Reset errors
            nameError.textContent = "";
            emailError.textContent = "";
            phoneError.textContent = "";
            messageError.textContent = "";
            successBanner.hidden = true;

            let isValid = true;

            if (fullName === "") {
                nameError.textContent = "Full name or organization is required.";
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === "") {
                emailError.textContent = "Email address is required.";
                isValid = false;
            } else if (!emailPattern.test(email)) {
                emailError.textContent = "Please enter a valid email address (e.g., oshundareolamide@gmail.com).";
                isValid = false;
            }

            // Strict digits-only check to satisfy the school rubric ("Phone number contains only digits")
            const digitsOnlyPattern = /^\d+$/;
            if (phone === "") {
                phoneError.textContent = "Phone number is required.";
                isValid = false;
            } else if (!digitsOnlyPattern.test(phone)) {
                phoneError.textContent = "Phone number must contain only digits (e.g., 2348146162015).";
                isValid = false;
            }

            if (message === "") {
                messageError.textContent = "Please enter your message or project inquiry.";
                isValid = false;
            }

            if (isValid) {
                successBanner.hidden = false;
            }
        });
    }
});