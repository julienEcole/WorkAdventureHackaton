const ActionBarButtonType = {
    button: "button",
    action: "action",
} as const;
type ActionBarButtonType = typeof ActionBarButtonType[keyof typeof ActionBarButtonType];

interface AddButtonActionBar {
    /*
    *   the id of the button action bar defined.
    */
    id: string,

    /*
    *   the label to display in button action bar.
    */
    label: string

    /*
    *   the type of button ('button' / 'action'). By default is 'button'.
    */
    type: ActionBarButtonType,

    /*
    *  the image of button associated, This parameter is nullable.
    */
    imageSrc: string

    /*
    *   the label displayed above the action button. This parameter is nullable.
    */
    toolTip: string
}