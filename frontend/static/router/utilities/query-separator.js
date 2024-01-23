 function querySeparator (urlTemplate, replacementObject) {
    for (let key in replacementObject) {
        if (replacementObject.hasOwnProperty(key)) {
            let pattern = new RegExp(":" + key, "g");
            urlTemplate = urlTemplate.replace(pattern, replacementObject[key]);
        }
    }

    return urlTemplate;
}

export default querySeparator;