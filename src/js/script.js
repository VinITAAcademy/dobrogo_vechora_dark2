'use strict';

$(document).ready(function () {
    $(".header-burger .show-form-partner-program-questionnaire").click(function (event) {
        $(".header-burger,.header-menu").toggleClass("active");
        $("body").toggleClass("lock");
    });
    $(".show-form-partner-program-questionnaire").click(function () {
        $("#form").fadeIn();
    });

    $(".close, .form").click(function () {
        $("#form").fadeOut();
        $("body").toggleClass("lock");
    });

    $(".form-content").click(function (event) {
        event.stopPropagation();
    });
    jQuery('#phone').inputmask({
        mask: '+38 (099) 999-99-99',
        greedy: false
    });
    $(".show-form-partner-program-questionnaire").click(function (event) {
        $("body").toggleClass("lock");
    });

    document.querySelector(".thanx-close").addEventListener("click", function () {
        document.querySelector(".thanx").style.display = "none";
        $("#form").fadeOut();
        var form = $("#form-partner-program-questionnaire");
        form[0].reset();
    });

    const form = document.getElementById("form");

    form.addEventListener("submit", formSend);

    async function formSend(event) {
        event.preventDefault();

        let error = formValidate(form);

        if (error === 0) {
            resetValidation(form);
            document.querySelector(".thanx").style.display = "block";
            const formData = new FormData(form);

            const apiUrl = "https://intita.com/api/v1/entrant";

            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });
        }
    }

    function formValidate(form) {
        let error = 0;
        let formRequired = document.querySelectorAll(".required");

        for (let i = 0; i < formRequired.length; i++) {
            const input = formRequired[i];
            formRemoveError(input);

            if (input.value.trim() === "") {
                formAddError(input);
                error++;
            } else {
                if (input.classList.contains("email")) {
                    if (testEmail(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.classList.contains("surname")) {
                    if (testSurname(input)) {
                        formAddError(input);
                        error++;
                    }
                }
                else if (input.classList.contains("phone")) {
                    if (testPhone(input)) {
                        formAddError(input);
                        error++;
                    }
                }
                else if (input.classList.contains("name")) {
                    if (testName(input)) {
                        formAddError(input);
                        error++;
                    }
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add("error");
        input.classList.add("error");
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove("error");
        input.classList.remove("error");
    }
    function testEmail(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
    function testName(input) {
        const minLength = 2;
        const maxLength = 30;
        const namePattern = /^[A-Za-zА-Яа-яЁёіІїЇґҐґ'-`]+$/;
        const value = input.value.trim();
        if (value.length >= minLength && value.length <= maxLength && namePattern.test(value)) {
            return false;
        } else {
            return true;
        }
    }
    function testSurname(input) {
        const minLength = 2;
        const maxLength = 20;
        const namePattern = /^[A-Za-zА-Яа-яЁёіІїЇґҐґ']+$/;
        const value = input.value.trim();
        if (value.length >= minLength && value.length <= maxLength && namePattern.test(value)) {
            return false;
        } else {
            return true;
        }
    }
    function testPhone(input) {
        const value = input.inputmask.unmaskedvalue();

        if (/^\d{9}$/.test(value)) {
            return false; // Поле містить рівно 10 цифр
        } else {
            return true; // Поле не містить 10 цифр або містить нецифрові символи
        }
    }
    function resetValidation(form) {
        let formRequired = document.querySelectorAll(".req");

        for (let i = 0; i < formRequired.length; i++) {
            const input = formRequired[i];
            formRemoveError(input);
        }
    }
});  