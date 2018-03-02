'use strict';


// import { taxBracket2018 as tb18, taxBracket2017 as tb17} from '/taxBrackets2017.js';
// import {taxCalculator} from '/taxCalculator.js';
const taxCalculator = (taxPayers, brackets, n=1, base = 0) => {
  let taxableIncome = taxPayers.taxableIncome;
  // if 2018 predictios use adjusted TI instead of 
  if (taxPayers.adgustedTI) {
    taxableIncome = taxPayers.adgustedTI;
  } else {
    taxableIncome = taxPayers.taxableIncome;
  }
  let limit = brackets[n].limit;
  let rate = brackets[n].rate;

  if ((n===1) && (taxableIncome > limit)) {
    base = rate * limit;
    n++;
    return taxCalculator(taxPayers, brackets, n, base);
  } else if ((n===7) && (taxableIncome > limit) ) {
    base = base + (rate * (taxableIncome - limit));
    return base;
  } else if ((1< n < 7) && (taxableIncome >= brackets[n-1].limit)) {
    let previousLimit = brackets[n-1].limit;
    
    if (taxableIncome <= limit) {
      base = base + (rate * (taxableIncome - previousLimit));
      return base;
    }
    else if (taxableIncome > limit) {
      n++;
      base = base + (rate * (limit - previousLimit));
      return taxCalculator(taxPayers, brackets, n, base);
    }
  }
  else {
    return base;
  }
};

const taxBrackets2018 = {
  // (C) UNMARRIED INDIVIDUALS OTHER 
  //THAN SURVIVING SPOUSES AND HEADS OF HOUSEHOLDS.—
  single: {
    // Not over $9,525 .....10% of taxable income. 
    1: {
      limit: 9525, 
      rate: .1,
    },
    // Over $9,525 but not over $38,700 .... $952.50, plus 12% of the excess over $9,525. 
    2: {
      limit: 38700,
      rate: .12,
    },
    // Over $38,700 but not over $82,500 .... $4,453.50, plus 22% of the excess over $38,700.     
    3: {
      limit: 82500,
      rate: .22,
    },
    // Over $82,500 but not over $157,500 .... $14,089.50, plus 24% of the excess over $82,500. 
    4: {
      limit: 157500,
      rate: .24,
    },
    // Over $157,500 but not over $200,000 .... $32,089.50, plus 32% of the excess over $157,500. 
    5: {
      limit: 200000,
      rate: .32,
    },
    // Over $200,000 but not over $500,000 .... $45,689.50, plus 35% of the excess over $200,000. 
    6: {
      limit: 500000,
      rate: .35,
    },
    // Over $500,000 .... $150,689.50, plus 37% of the excess over $500,000.
    7: {
      limit: 500000,
      rate: .37,
    }
  },
  joint: {
    // Not over $19,050 .... 10% of taxable income. 
    1: {
      limit: 19050,
      rate: .1
    },
    // Over $19,050 but not over $77,400 .... $1,905, plus 12% of the excess over $19,050. 
    2: {
      limit: 77400,
      rate: .12
    },
    // Over $77,400 but not over $165,000 .... $8,907, plus 22% of the excess over $77,400. 
    3: {
      limit: 165000,
      rate: .22
    },
    // Over $165,000 but not over $315,000 .... $28,179, plus 24% of the excess over $165,000. 
    4: {
      limit: 315000,
      rate: .24
    },
    // Over $315,000 but not over $400,000 ...... $64,179, plus 32% of the excess over $315,000. 
    5: {
      limit: 400000,
      rate: .32
    },
    // Over $400,000 but not over $600,000 ...... $91,379, plus 35% of the excess over $400,000. 
    6: {
      limit: 600000,
      rate: .35
    },
    // Over $600,000 ........................................... $161,379, plus 37% of the excess over $600,000.
    7: {
      limit: 600000,
      rate: .37
    }
  }

};

// Taxable Income	Rate
const taxBrackets2017 = {
  single: {
    // $0 - $9,325	10.00%
    1: {
      limit: 9325, 
      rate: .1
    },
    // $9,325 - $37,950	15.00%
    2: {
      limit: 37950,
      rate: .15
    },
    // $37,950 - $91,900	25.00%
    3: {
      limit: 91900,
      rate: .25
    },
    // $91,900 - $191,650	28.00%
    4: {
      limit: 191650,
      rate: .28
    },
    // $191,650 - $416,700	33.00%
    5: {
      limit: 416700,
      rate: .33
    },
    // $416,700 - $418,400	35.00%
    6: {
      limit: 418400,
      rate: .35
    },
    // $418,400+	39.60%
    7: {
      limit: 418400,
      rate: .396
    }
  }, 
  joint: {}
};

// tP = tax payer
const tP = {
  filingStatus: 'single',
  AGI: false, 
  taxableIncome: false,
  QBI: false,
  adgustedTI: false
};
// function to calculate the new Taxable Income with the 20% deduction on QBI
const taxableIncome2018Calculator = tP => {
  let qbi = tP.QBI;
  let status = tP.filingStatus;
  if ( (qbi>0) && tP.taxableIncome < 157500 && (status === 'single')) {
    let deduction = 0.2 * qbi;
    console.log('new QBI '+ (qbi - deduction));
    return tP.adgustedTI = tP.taxableIncome - deduction;
  } else if ( (207500 > tP.taxableIncome > 157500) && (status === 'single')) {
    return 'we need to calculate 20% deduction vs 50% of wages paid'
  } else {
    return 'We have a problem with taxableIncome2018Calculator';
  }
};

const breakCalculator = (tP) => {
  taxableIncome2018Calculator(tP);
  let tax17 = taxCalculator(tP,taxBrackets2017.single);
  let tax18 = taxCalculator(tP, taxBrackets2018.single);
  return (tax17 - tax18);
};

const renderTheTaxBreak = () => {
  const breaks = breakCalculator(tP);
  const results = `
    <div>
      <h2> You are going to save $${breaks} </h2>
    </div>
  `;
  $('.tax-break').html(results);
};

const watchSubmit = () => {
  $('.form').submit(event => {
    event.preventDefault();
    tP.firstName = $(event.currentTarget).find('#first-name').val();
    tP.lastName = $(event.currentTarget).find('#last-name').val();
    tP.email = $(event.currentTarget).find('#email').val();
    tP.filingStatus = $(event.currentTarget).find('#status').val();
    tP.QBI = $(event.currentTarget).find('#2017QBI').val();
    tP.AGI = $(event.currentTarget).find('#2017AGI').val();
    tP.taxableIncome = $(event.currentTarget).find('#2017TI').val();
    console.log(tP.firstName + ' ' + tP.lastName + ' ' + ' ' + tP.filingStatus + ' '+ tP.AGI);
    // const queryTarget = $(event.currentTarget).find('.js-query');
    // const query = queryTarget.val();
    // // clear out the input
    // queryTarget.val("");
    renderTheTaxBreak();
    console.log(breakCalculator(tP));
    // getDataFromApi(query, displayGitHubSearchData);
  });
};

$(watchSubmit);


