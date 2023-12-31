'use strict';

$(document).ready(function () {
    function checkScreenWidth() {
        if ($(window).width() > 765) {
            $(".header-burger, .header-menu, .blur-background").removeClass("active");
            $("body").removeClass("lock");
        }
    }
    $(window).resize(function () {
        checkScreenWidth();
    });
    $(".header-burger").click(function (event) {
        $(".header-burger,.header-menu").toggleClass("active");
        $("body").toggleClass("lock");
        let blurBackground = $(".blur-background");
        if (blurBackground.hasClass('active')) {
            blurBackground.removeClass('active');
        } else {
            blurBackground.addClass('active');
        }
    });
    $(".show-form-partner-program-questionnaire").click(function () {
        $("#form").fadeIn();
    });

    $(".close, .form, #close-form-partner").click(function () {
        $("#form").fadeOut();
        $("body").toggleClass("lock");
    });

    $(".form-content, .form-content-paticipant").click(function (event) {
        event.stopPropagation();
    });
    jQuery('#phone, #phone1').inputmask({
        mask: '+38 (099) 999-99-99',
        greedy: false
    });
    $(".show-form-partner-program-questionnaire").click(function (event) {
        $("body").toggleClass("lock");
    });
    $(".form-button-paticipant").click(function () {
        $("#form-for-paticipant").fadeIn();
    });
    $(".close, .form-paticipant, #close-form-participant").click(function () {
        $("#form-for-paticipant").fadeOut();
        $("body").toggleClass("lock");
    });
    $(".pin-block-patriot").click(function (event) {
        $("body").toggleClass("lock");
    });
    function sanitizeInput(inputElementId, maxLength) {
        document.getElementById(inputElementId).addEventListener("input", function () {
            let inputValue = this.value;
            let sanitizedValue = inputValue.replace(/[^A-Za-zА-Яа-яЁёІіЇїҐґ\s'’-]/g, '');
            sanitizedValue = sanitizedValue.substr(0, maxLength);
            this.value = sanitizedValue;
        });
    }

    sanitizeInput("last-name-partner", 30);
    sanitizeInput("last-name-participant", 30);
    sanitizeInput("name", 20);
    sanitizeInput("name_participant", 20);


    document.querySelector(".thanx-close").addEventListener("click", function () {
        document.querySelector(".thanx").style.display = "none";
        $("#form").fadeOut();
        $("body").toggleClass("lock");
        var form = $("#form-partner-program-questionnaire");
        form[0].reset();
    });

    const formPartner = document.getElementById("form-partner-program-questionnaire");
    const formPaticipant = document.getElementById("form-participant-program");

    formPartner.addEventListener("submit", function (event) {
        event.preventDefault();
        formSend(formPartner);
    });

    formPaticipant.addEventListener("submit", function (event) {
        event.preventDefault();
        formSend(formPaticipant);
    });

    function formSend(form) {

        let error = formValidate(form);

        if (error === 0) {
            document.querySelector(".thanx").style.display = "block";
            resetValidation(form);
            grecaptcha.ready(function () {
                grecaptcha.execute('6LfjdXUnAAAAAO68m7JLRXV61_dnTkHgl9k5xW1j', { action: 'submit' }).then(function (token) {

                    const formData = new FormData(form);
                    const apiUrl = "https://intita.com/api/v1/entrant";

                    formData.append('g-recaptcha-response', token);

                    $.ajax({
                        url: apiUrl,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (data) {
                            return;
                        },
                        error: function (data) {
                            return;
                        }
                    });
                });
            });

        }
    }

    function formValidate(form) {
        let error = 0;
        let formRequired = form.querySelectorAll(".required");

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
