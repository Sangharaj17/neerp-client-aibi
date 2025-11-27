package com.aibi.neerp.util;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AmountToWordsService {

    public String convertAmountToWords(BigDecimal amount) {
        if (amount == null) {
            return "Zero Rupees";
        }

        long rupees = amount.longValue();
        int paise = amount.remainder(BigDecimal.ONE).movePointRight(2).intValue();

        String rupeesInWords = convertNumberToWords(rupees);
        String paiseInWords = paise > 0 ? convertNumberToWords(paise) : "";

        if (rupees > 0 && paise > 0) {
            return rupeesInWords + " Rupees and " + paiseInWords + " Paise Only";
        } else if (rupees > 0) {
            return rupeesInWords + " Rupees Only";
        } else {
            return paiseInWords + " Paise Only";
        }
    }

    private String convertNumberToWords(long number) {
        if (number == 0) return "Zero";

        String[] units = { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
                "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
                "Seventeen", "Eighteen", "Nineteen" };

        String[] tens = { "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

        StringBuilder words = new StringBuilder();

        if ((number / 10000000) > 0) {
            words.append(convertNumberToWords(number / 10000000)).append(" Crore ");
            number %= 10000000;
        }

        if ((number / 100000) > 0) {
            words.append(convertNumberToWords(number / 100000)).append(" Lakh ");
            number %= 100000;
        }

        if ((number / 1000) > 0) {
            words.append(convertNumberToWords(number / 1000)).append(" Thousand ");
            number %= 1000;
        }

        if ((number / 100) > 0) {
            words.append(convertNumberToWords(number / 100)).append(" Hundred ");
            number %= 100;
        }

        if (number > 0) {
            if (words.length() > 0) words.append("and ");

            if (number < 20) {
                words.append(units[(int) number]);
            } else {
                words.append(tens[(int) number / 10]);
                if ((number % 10) > 0) {
                    words.append(" ").append(units[(int) number % 10]);
                }
            }
        }

        return words.toString().trim();
    }
}

