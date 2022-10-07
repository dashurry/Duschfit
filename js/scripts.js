(function (c) {
    "undefined" !== typeof wpcf7 &&
        null !== wpcf7 &&
        ((wpcf7 = c.extend({ cached: 0, inputs: [] }, wpcf7)),
        c(function () {
            wpcf7.supportHtml5 = (function () {
                var d = {},
                    a = document.createElement("input");
                d.placeholder = "placeholder" in a;
                c.each("email url tel number range date".split(" "), function (c, f) {
                    a.setAttribute("type", f);
                    d[f] = "text" !== a.type;
                });
                return d;
            })();
            c("div.wpcf7 > form").each(function () {
                var d = c(this);
                wpcf7.initForm(d);
                wpcf7.cached && wpcf7.refill(d);
            });
        }),
        (wpcf7.getId = function (d) {
            return parseInt(c('input[name="_wpcf7"]', d).val(), 10);
        }),
        (wpcf7.initForm = function (d) {
            var a = c(d);
            a.submit(function (b) {
                wpcf7.supportHtml5.placeholder ||
                    c("[placeholder].placeheld", a).each(function (b, a) {
                        c(a).val("").removeClass("placeheld");
                    });
                "function" === typeof window.FormData && (wpcf7.submit(a), b.preventDefault());
            });
            c(".wpcf7-submit", a).after('<span class="ajax-loader"></span>');
            wpcf7.toggleSubmit(a);
            a.on("click", ".wpcf7-acceptance", function () {
                wpcf7.toggleSubmit(a);
            });
            c(".wpcf7-exclusive-checkbox", a).on("click", "input:checkbox", function () {
                var b = c(this).attr("name");
                a.find('input:checkbox[name="' + b + '"]')
                    .not(this)
                    .prop("checked", !1);
            });
            c(".wpcf7-list-item.has-free-text", a).each(function () {
                var b = c(":input.wpcf7-free-text", this),
                    a = c(this).closest(".wpcf7-form-control");
                c(":checkbox, :radio", this).is(":checked") ? b.prop("disabled", !1) : b.prop("disabled", !0);
                a.on("change", ":checkbox, :radio", function () {
                    c(".has-free-text", a).find(":checkbox, :radio").is(":checked") ? b.prop("disabled", !1).focus() : b.prop("disabled", !0);
                });
            });
            wpcf7.supportHtml5.placeholder ||
                c("[placeholder]", a).each(function () {
                    c(this).val(c(this).attr("placeholder"));
                    c(this).addClass("placeheld");
                    c(this).focus(function () {
                        c(this).hasClass("placeheld") && c(this).val("").removeClass("placeheld");
                    });
                    c(this).blur(function () {
                        "" === c(this).val() && (c(this).val(c(this).attr("placeholder")), c(this).addClass("placeheld"));
                    });
                });
            wpcf7.jqueryUi &&
                !wpcf7.supportHtml5.date &&
                a.find('input.wpcf7-date[type="date"]').each(function () {
                    c(this).datepicker({ dateFormat: "yy-mm-dd", minDate: new Date(c(this).attr("min")), maxDate: new Date(c(this).attr("max")) });
                });
            wpcf7.jqueryUi &&
                !wpcf7.supportHtml5.number &&
                a.find('input.wpcf7-number[type="number"]').each(function () {
                    c(this).spinner({ min: c(this).attr("min"), max: c(this).attr("max"), step: c(this).attr("step") });
                });
            c(".wpcf7-character-count", a).each(function () {
                var b = c(this),
                    d = b.attr("data-target-name"),
                    h = b.hasClass("down"),
                    l = parseInt(b.attr("data-starting-value"), 10),
                    g = parseInt(b.attr("data-maximum-value"), 10),
                    e = parseInt(b.attr("data-minimum-value"), 10),
                    k = function (a) {
                        a = c(a).val().length;
                        var d = h ? l - a : a;
                        b.attr("data-current-value", d);
                        b.text(d);
                        g && g < a ? b.addClass("too-long") : b.removeClass("too-long");
                        e && a < e ? b.addClass("too-short") : b.removeClass("too-short");
                    };
                c(':input[name="' + d + '"]', a).each(function () {
                    k(this);
                    c(this).keyup(function () {
                        k(this);
                    });
                });
            });
            a.on("change", ".wpcf7-validates-as-url", function () {
                var b = c.trim(c(this).val());
                b && !b.match(/^[a-z][a-z0-9.+-]*:/i) && -1 !== b.indexOf(".") && ((b = b.replace(/^\/+/, "")), (b = "http://" + b));
                c(this).val(b);
            });
        }),
        (wpcf7.submit = function (d) {
            if ("function" === typeof window.FormData) {
                var a = c(d);
                c(".ajax-loader", a).addClass("is-active");
                wpcf7.clearResponse(a);
                d = new FormData(a.get(0));
                var b = { id: a.closest("div.wpcf7").attr("id"), status: "init", inputs: [], formData: d };
                c.each(a.serializeArray(), function (c, a) {
                    if ("_wpcf7" == a.name) b.contactFormId = a.value;
                    else if ("_wpcf7_version" == a.name) b.pluginVersion = a.value;
                    else if ("_wpcf7_locale" == a.name) b.contactFormLocale = a.value;
                    else if ("_wpcf7_unit_tag" == a.name) b.unitTag = a.value;
                    else if ("_wpcf7_container_post" == a.name) b.containerPostId = a.value;
                    else if (a.name.match(/^_wpcf7_\w+_free_text_/)) {
                        var d = a.name.replace(/^_wpcf7_\w+_free_text_/, "");
                        b.inputs.push({ name: d + "-free-text", value: a.value });
                    } else a.name.match(/^_/) || b.inputs.push(a);
                });
                wpcf7.triggerEvent(a.closest("div.wpcf7"), "beforesubmit", b);
                var f = function (a, d, g, e) {
                    b.id = c(a.into).attr("id");
                    b.status = a.status;
                    b.apiResponse = a;
                    d = c(".wpcf7-response-output", e);
                    switch (a.status) {
                        case "validation_failed":
                            c.each(a.invalidFields, function (a, b) {
                                c(b.into, e).each(function () {
                                    wpcf7.notValidTip(this, b.message);
                                    c(".wpcf7-form-control", this).addClass("wpcf7-not-valid");
                                    c("[aria-invalid]", this).attr("aria-invalid", "true");
                                });
                            });
                            d.addClass("wpcf7-validation-errors");
                            e.addClass("invalid");
                            wpcf7.triggerEvent(a.into, "invalid", b);
                            break;
                        case "acceptance_missing":
                            d.addClass("wpcf7-acceptance-missing");
                            e.addClass("unaccepted");
                            wpcf7.triggerEvent(a.into, "unaccepted", b);
                            break;
                        case "spam":
                            d.addClass("wpcf7-spam-blocked");
                            e.addClass("spam");
                            wpcf7.triggerEvent(a.into, "spam", b);
                            break;
                        case "aborted":
                            d.addClass("wpcf7-aborted");
                            e.addClass("aborted");
                            wpcf7.triggerEvent(a.into, "aborted", b);
                            break;
                        case "mail_sent":
                            d.addClass("wpcf7-mail-sent-ok");
                            e.addClass("sent");
                            wpcf7.triggerEvent(a.into, "mailsent", b);
                            break;
                        case "mail_failed":
                            d.addClass("wpcf7-mail-sent-ng");
                            e.addClass("failed");
                            wpcf7.triggerEvent(a.into, "mailfailed", b);
                            break;
                        default:
                            (g = "custom-" + a.status.replace(/[^0-9a-z]+/i, "-")), d.addClass("wpcf7-" + g), e.addClass(g);
                    }
                    wpcf7.refill(e, a);
                    wpcf7.triggerEvent(a.into, "submit", b);
                    "mail_sent" == a.status &&
                        (e.each(function () {
                            this.reset();
                        }),
                        wpcf7.toggleSubmit(e));
                    wpcf7.supportHtml5.placeholder ||
                        e.find("[placeholder].placeheld").each(function (a, b) {
                            c(b).val(c(b).attr("placeholder"));
                        });
                    d.html("").append(a.message).slideDown("fast");
                    d.attr("role", "alert");
                    c(".screen-reader-response", e.closest(".wpcf7")).each(function () {
                        var b = c(this);
                        b.html("").attr("role", "").append(a.message);
                        if (a.invalidFields) {
                            var d = c("<ul></ul>");
                            c.each(a.invalidFields, function (a, b) {
                                var e = b.idref
                                    ? c("<li></li>").append(
                                          c("<a></a>")
                                              .attr("href", "#" + b.idref)
                                              .append(b.message)
                                      )
                                    : c("<li></li>").append(b.message);
                                d.append(e);
                            });
                            b.append(d);
                        }
                        b.attr("role", "alert").focus();
                    });
                };
                c.ajax({ type: "POST", url: wpcf7.apiSettings.getRoute("/contact-forms/" + wpcf7.getId(a) + "/feedback"), data: d, dataType: "json", processData: !1, contentType: !1 })
                    .done(function (b, d, g) {
                        f(b, d, g, a);
                        c(".ajax-loader", a).removeClass("is-active");
                    })
                    .fail(function (b, d, g) {
                        b = c('<div class="ajax-error"></div>').text(g.message);
                        a.after(b);
                    });
            }
        }),
        (wpcf7.triggerEvent = function (d, a, b) {
            d = c(d);
            var f = new CustomEvent("wpcf7" + a, { bubbles: !0, detail: b });
            d.get(0).dispatchEvent(f);
            d.trigger("wpcf7:" + a, b);
            d.trigger(a + ".wpcf7", b);
        }),
        (wpcf7.toggleSubmit = function (d, a) {
            var b = c(d),
                f = c("input:submit", b);
            "undefined" !== typeof a
                ? f.prop("disabled", !a)
                : b.hasClass("wpcf7-acceptance-as-validation") ||
                  (f.prop("disabled", !1),
                  c(".wpcf7-acceptance", b).each(function () {
                      var a = c(this),
                          b = c("input:checkbox", a);
                      if (!a.hasClass("optional") && ((a.hasClass("invert") && b.is(":checked")) || (!a.hasClass("invert") && !b.is(":checked")))) return f.prop("disabled", !0), !1;
                  }));
        }),
        (wpcf7.notValidTip = function (d, a) {
            var b = c(d);
            c(".wpcf7-not-valid-tip", b).remove();
            c('<span role="alert" class="wpcf7-not-valid-tip"></span>').text(a).appendTo(b);
            if (b.is(".use-floating-validation-tip *")) {
                var f = function (a) {
                    c(a)
                        .not(":hidden")
                        .animate({ opacity: 0 }, "fast", function () {
                            c(this).css({ "z-index": -100 });
                        });
                };
                b.on("mouseover", ".wpcf7-not-valid-tip", function () {
                    f(this);
                });
                b.on("focus", ":input", function () {
                    f(c(".wpcf7-not-valid-tip", b));
                });
            }
        }),
        (wpcf7.refill = function (d, a) {
            var b = c(d),
                f = function (a, b) {
                    c.each(b, function (b, c) {
                        a.find(':input[name="' + b + '"]').val("");
                        a.find("img.wpcf7-captcha-" + b).attr("src", c);
                        var d = /([0-9]+)\.(png|gif|jpeg)$/.exec(c);
                        a.find('input:hidden[name="_wpcf7_captcha_challenge_' + b + '"]').attr("value", d[1]);
                    });
                },
                h = function (a, b) {
                    c.each(b, function (b, c) {
                        a.find(':input[name="' + b + '"]').val("");
                        a.find(':input[name="' + b + '"]')
                            .siblings("span.wpcf7-quiz-label")
                            .text(c[0]);
                        a.find('input:hidden[name="_wpcf7_quiz_answer_' + b + '"]').attr("value", c[1]);
                    });
                };
            "undefined" === typeof a
                ? c
                      .ajax({
                          type: "GET",
                          url: wpcf7.apiSettings.getRoute("/contact-forms/" + wpcf7.getId(b) + "/refill"),
                          beforeSend: function (a) {
                              var c = b.find(':input[name="_wpnonce"]').val();
                              c && a.setRequestHeader("X-WP-Nonce", c);
                          },
                          dataType: "json",
                      })
                      .done(function (a, c, d) {
                          a.captcha && f(b, a.captcha);
                          a.quiz && h(b, a.quiz);
                      })
                : (a.captcha && f(b, a.captcha), a.quiz && h(b, a.quiz));
        }),
        (wpcf7.clearResponse = function (d) {
            d = c(d);
            d.removeClass("invalid spam sent failed");
            d.siblings(".screen-reader-response").html("").attr("role", "");
            c(".wpcf7-not-valid-tip", d).remove();
            c("[aria-invalid]", d).attr("aria-invalid", "false");
            c(".wpcf7-form-control", d).removeClass("wpcf7-not-valid");
            c(".wpcf7-response-output", d).hide().empty().removeAttr("role").removeClass("wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked");
        }),
        (wpcf7.apiSettings.getRoute = function (c) {
            var a = wpcf7.apiSettings.root;
            return (a = a.replace(wpcf7.apiSettings.namespace, wpcf7.apiSettings.namespace + c));
        }));
})(jQuery);
(function () {
    function c(c, a) {
        a = a || { bubbles: !1, cancelable: !1, detail: void 0 };
        var b = document.createEvent("CustomEvent");
        b.initCustomEvent(c, a.bubbles, a.cancelable, a.detail);
        return b;
    }
    if ("function" === typeof window.CustomEvent) return !1;
    c.prototype = window.Event.prototype;
    window.CustomEvent = c;
})();
