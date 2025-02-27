(function ($) {
    return $.fn.xlAjaxChosen = function (settings, callback, chosenOptions) {
        var chosenXhr, defaultOptions, options, select;
        if (settings == null) {
            settings = {};
        }
        if (chosenOptions == null) {
            chosenOptions = {};
        }
        defaultOptions = {
            minTermLength: 3,
            afterTypeDelay: 500,
            jsonTermKey: "term",
            keepTypingMsg: "Keep typing...",
            lookingForMsg: "Looking for"
        };
        select = this;
        chosenXhr = null;
        options = $.extend({}, defaultOptions, $(select).data(), settings);
        this.xlChosen(chosenOptions ? chosenOptions : {});
        return this.each(function () {
                return $(this).next('.chosen-container').find(".search-field > input, .chosen-search > input").bind('keyup', function () {

                    cmb2_select_last_interact = $(this).parents(".chosen-container").prev("select");
                    var field, msg, success, untrimmed_val, val;
                    untrimmed_val = $(this).val();
                    val = $.trim($(this).val());
                    msg = val.length < options.minTermLength ? options.keepTypingMsg : options.lookingForMsg + (" '" + val + "'");
                    select.next('.chosen-container').find('.no-results').text(msg);

                    if (val.length === 0) {
                        selected_values_pre = [];
                        select.find('option').each(function () {
                            if (!$(this).is(":selected")) {
                                return $(this).remove();
                            } else {
                                return selected_values_pre.push($(this).val() + "-" + $(this).text());
                            }
                        });

                        var element_pre = [];
                        if (typeof select.attr("data-pre-data") !== "undefined") {

                            element_pre = JSON.parse(select.attr("data-pre-data"));
                        }
                        $.each(element_pre, function (key, val) {

                            if (typeof val === "string") {
                                value = i;
                                text = val;
                            } else {
                                value = val.value;
                                text = val.text;
                            }
                            if ($.inArray(value + "-" + text, selected_values_pre) === -1) {

                                return $("<option />").attr('value', value).html(text).appendTo(select);
                            }
                        });

                        select.trigger("chosen:updated");
                        return false;
                    }

                    if (val === $(this).data('prevVal')) {
                        return false;
                    }
                    $(this).data('prevVal', val);
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    if (val.length < options.minTermLength) {
                        return false;
                    }
                    field = $(this);
                    if (options.data == null) {
                        options.data = {};
                    }
                    options.data[options.jsonTermKey] = val;
                    if (options.dataCallback != null) {
                        options.data = options.dataCallback(options.data);
                    }
                    success = options.success;
                    options.success = function (data) {

                        select = cmb2_select_last_interact;

                        var items, nbItems, selected_values;
                        if (data == null) {
                            return;
                        }
                        selected_values = [];
                        select.find('option').each(function () {
                            if (!$(this).is(":selected")) {
                                return $(this).remove();
                            } else {
                                return selected_values.push($(this).val() + "-" + $(this).text());
                            }
                        });
                        select.find('optgroup:empty').each(function () {
                            return $(this).remove();
                        });
                        items = callback != null ? callback(data, field) : data;

                        nbItems = 0;
                        $.each(items, function (i, element) {
                            var group, text, value;
                            nbItems++;
                            if (element.group) {
                                group = select.find("optgroup[label='" + element.text + "']");
                                if (!group.size()) {
                                    group = $("<optgroup />");
                                }
                                group.attr('label', element.text).appendTo(select);
                                return $.each(element.items, function (i, element) {
                                    var text, value;
                                    if (typeof element === "string") {
                                        value = i;
                                        text = element;
                                    } else {
                                        value = element.value;
                                        text = element.text;
                                    }
                                    if ($.inArray(value + "-" + text, selected_values) === -1) {
                                        return $("<option />").attr('value', value).html(text).appendTo(group);
                                    }
                                });
                            } else {
                                if (typeof element === "string") {
                                    value = i;
                                    text = element;
                                } else {
                                    value = element.value;
                                    text = element.text;
                                }
                                if ($.inArray(value + "-" + text, selected_values) === -1) {
                                    return $("<option />").attr('value', value).html(text).appendTo(select);
                                }
                            }
                        });
                        if (nbItems) {
                            select.trigger("chosen:updated");
                        } else {
                            select.data().chosen.no_results_clear();
                            select.data().chosen.no_results(field.val());
                        }
                        if (settings.success != null) {
                            settings.success(data);
                        }
                        return field.val(untrimmed_val);
                    };
                    return this.timer = setTimeout(function () {
                        if (chosenXhr) {
                            chosenXhr.abort();
                        }
                        return chosenXhr = $.ajax(options);
                    }, options.afterTypeDelay);
                });
            }
        );
    }
        ;
})
(jQuery);