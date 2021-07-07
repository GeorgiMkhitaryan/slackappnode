module.exports = (options) => {
  let { to, from, code } = options;
  return {
    to,
    from,
    subject: "Company activate",
    html: `
            <div style="width: 100%;">
                <div style="width: 600px; height: 520px; background: #FFFFFF;">
                    <div style="width: 500px; height: 420px; background: #FFFFFF;">
                        <div>
                            <span style="font-family: Ubuntu; margin-right: 10px; font-style: normal; font-weight: 500; font-size: 25px;font-weight: bold;">Code ${code}</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
  };
};
