export function getPdfHeader(logoBase64: string, companyName: string, reportTitle: string): any {
  return {
    columns: [
      {
        image: logoBase64,
        width: 50,
        alignment: 'left',
        margin: [40, 0, 0, 0]
      },
      {
        text: companyName,
        alignment: 'center',
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 0]
      },
      {
        text: reportTitle,
        alignment: 'right',
        fontSize: 10,
        italics: true,
        margin: [0, 15, 40, 0]
      }
    ],
    margin: [0, 10, 0, 10]
  };
}

export function getPdfFooter(userName: string, dateTime: string): any {
  return function (currentPage: number, pageCount: number) {
    return {
      columns: [
        { text: `Generado por: ${userName}`, alignment: 'left', margin: [40, 0] },
        { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' },
        { text: `Fecha: ${dateTime}`, alignment: 'right', margin: [0, 0, 40, 0] }
      ],
      fontSize: 9
    };
  };
}
