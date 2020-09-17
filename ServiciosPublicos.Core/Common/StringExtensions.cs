using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Common
{
    public static class StringExtensions
    {

        #region STRING EXTENSIONS
        /// <summary>
        /// Converts String to Bool
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static bool ParseBool(this String val)
        {

            val = val != null ? val.ToUpper() : string.Empty;
            if (val != null && (val == "1" || val == "TRUE" || val == "Y") || val == "T" || val == "YES")
                return true;

            // else doesn't meet true condition
            return false;
        }

        /// <summary>
        /// Converts Char to Bool
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static bool ParseBoolChar(this char val)
        {


            if (val != ' ' && (val == '1' || val == 'T' || val == 'Y'))
                return true;

            // else doesn't meet true condition
            return false;
        }

        /// <summary>
        /// Converts Char to Bool
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static bool ParseBoolChar(this char? val)
        {


            if (val != ' ' && (val == '1' || val == 'T' || val == 'Y'))
                return true;

            // else doesn't meet true condition
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="val"></param>
        /// <param name="defaultVal"></param>
        /// <returns></returns>
        public static double ParseDouble(string val, double defaultVal)
        {
            double value = 0;
            bool success;

            success = double.TryParse(val, out value);

            if (success)
                return value;
            else
                return defaultVal;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static double ParseDouble(this string val)
        {
            return ParseDouble(val, 0);

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static int ParseInt(this string val)
        {

            return ParseInt(val, 0);
        }

        /// <summary>
        /// Attempt to parse string into integer.  Returns default value if error occurs
        /// </summary>
        /// <param name="val"></param>
        /// <param name="defaultVal"></param>
        /// <returns></returns>
        public static int ParseInt(string val, int defaultVal)
        {

            int value = 0;
            bool success;

            success = int.TryParse(val, out value);

            if (success)
                return value;
            else
                return defaultVal;

        }

        /// <summary>
        /// parses string into Decimal value. Returns default value if error occurs
        /// </summary>
        /// <param name="val"></param>
        /// <param name="defaultVal"></param>
        /// <returns></returns>
        public static Decimal ParseDecimal(string val, long defaultVal)
        {

            decimal value = 0;
            bool success;

            success = decimal.TryParse(val, out value);

            if (success)
                return value;
            else
                return defaultVal;
        }

        /// <summary>
        /// parses string into DateTime value. Returns default value if error occurs
        /// </summary>
        /// <param name="val"></param>
        /// <param name="defaultVal"></param>
        /// <returns></returns>
        public static DateTime ParseDate(string val)
        {

            DateTime value = DateTime.Now;
            bool success;

            success = DateTime.TryParse(val, out value);
            return value;
        }



        /// <summary>
        /// Parses and returns decimal, 2 last chars as Floating points
        /// </summary>
        /// <param name="val"></param>
        /// <returns>Decimal value. Zero if exception occurs</returns>
        public static Decimal ParseDecimalFix(this string val)
        {

            return ParseDecimal(val, 0);
        }

        public static string removeExtension(this string input)
        {
            string[] arr = input.Split('.');
            if (arr != null && arr.Length > 0)
                return arr[0];
            else
                return input;

        }


        /// <summary>
        /// Removes characters from Reading at Config file and remove them.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string FixString(this string input)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in input.ToLower())
            {
                if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z'))
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }

        public static string ToFormat(this string input, params object[] args)
        {
            return string.Format(input, args);
        }
        #endregion
    }
}
