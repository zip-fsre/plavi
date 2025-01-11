using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjektCS.Data;

namespace ProjektCS.Models
{
    public class DOGADJAJ
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string? NAZIV { get; set; }
        public DateTime? DATUM { get; set; }
        public string? LOKACIJA { get; set; }
        public string? SVRHA { get; set; }
        public string? IME_ORGANIZATORA { get; set; }
        public string? KONTAKT_ORGANIZATORA { get; set; }
        public int? BROJ_GOSTIJU { get; set; }
    }

    
}
