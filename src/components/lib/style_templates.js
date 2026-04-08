export const createStyleTemplate = () => {
  const flex_display = {
    row: `
            display: flex;
            flex-direction: row;
        `,
    column: `
            display: flex;
            flex-direction: column;
        `,
    centered: `
            justify-content: center;
            align-items: center;
        `,
    get row_centered() {
      return `${flex_display.row}${flex_display.centered}`;
    },
    get column_centered() {
      return `${flex_display.column}${flex_display.centered}`;
    },
    row_custom: (justify = 'space-around', align = 'center') => `
            ${flex_display.row}
            justify-content: ${justify};
            align-items: ${align};
        `,
    column_custom: (justify = 'flex-start', align = 'center') => `
            ${flex_display.column}
            justify-content: ${justify};
            align-items: ${align};
        `,
  };

  return { flex_display };
};

export const style_template = createStyleTemplate();
