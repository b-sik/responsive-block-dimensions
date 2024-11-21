/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

console.log("this is loading atleast");

function addAttributes(settings, name) {
    if (typeof settings.attributes !== "undefined") {
        if (name === "core/paragraph") {
            settings.attributes = Object.assign(settings.attributes, {
                // eventually replace attributes.style.spacing
                // OR create attributes.style.dimensions and keep original as 'backup'
                rsd: {
                    type: "object",
                    default: {
                        desktop: {
                            margin: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                            padding: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                        },
                        tablet: {
                            margin: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                            padding: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                        },
                        mobile: {
                            margin: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                            padding: {
                                top: "",
                                bottom: "",
                                left: "",
                                right: "",
                            },
                        },
                    },
                },
            });
        }
    }

    return settings;
}

wp.hooks.addFilter("blocks.registerBlockType", "rbd/atts", addAttributes);

const addControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const [responsiveView, setResponsiveView] =
            wp.element.useState("desktop");

        const { Fragment } = wp.element;
        const { RadioControl } = wp.components;
        const { InspectorControls } = wp.blockEditor;
        const { attributes, setAttributes, isSelected } = props;

        // Create an observer instance and configure it
        wp.element.useEffect(() => {
            let observer = null;
            let targetElement = document.querySelector(".is-root-container");

            if (!targetElement) {
                const iframe = document.querySelector(
                    "iframe[name='editor-canvas']"
                );
                const innerDoc =
                    iframe.contentDocument || iframe.contentWindow.document;
                targetElement = innerDoc.querySelector(".is-root-container");
            }

            if (targetElement.classList.contains("is-desktop-preview")) {
                setResponsiveView("desktop");
            } else {
                if (targetElement.classList.contains("is-tablet-preview")) {
                    setResponsiveView("tablet");
                } else if (
                    targetElement.classList.contains("is-mobile-preview")
                ) {
                    setResponsiveView("mobile");
                }

                observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === "class") {
                            if (
                                mutation.target.classList.contains(
                                    "is-tablet-preview"
                                )
                            ) {
                                setResponsiveView("tablet");
                            } else if (
                                mutation.target.classList.contains(
                                    "is-mobile-preview"
                                )
                            ) {
                                setResponsiveView("mobile");
                            }
                        }
                    });
                });

                observer.observe(targetElement, {
                    attributes: true,
                    attributeFilter: ["class"],
                });
            }

            return () => (observer ? observer.disconnect() : null);
        }, []);

        // Create three toggles: desktop, tablet, and mobile
        // Toggle on depending which view is selected in editor
        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected && props.name === "core/paragraph" && (
                    <InspectorControls group="dimensions">
                        <RadioControl
                            label={wp.i18n.__("Responsive dimensions", "rbd")}
                            help={wp.i18n.__("Select responsive view", "rbd")}
                            selected={responsiveView}
                            options={[
                                { label: "desktop", value: "desktop" },
                                { label: "mobile", value: "mobile" },
                                { label: "tablet", value: "tablet" },
                            ]}
                            onChange={(value) => setResponsiveView(value)}
                        />
                    </InspectorControls>
                )}
            </Fragment>
        );
    };
}, "addControls");

wp.hooks.addFilter("editor.BlockEdit", "rbd/controls", addControls);

function applyStylesEditor(extraProps, blockType, attributes) {
    return extraProps;
}

wp.hooks.addFilter(
    "blocks.getSaveContent.extraProps",
    "rbd/apply-styles-editor",
    applyStylesEditor
);
