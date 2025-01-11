using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjektCS.Data;

namespace ProjektCS.Models
{
    public class Gost
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int? ID_DOGADJAJA { get; set; }
        public string? IME_I_PREZIME { get; set; }
        public int? BROJ_STOLA { get; set; }
        public string? STATUS_GOSTA { get; set; }
        public int? STATUS_DOLASKA { get; set; }
    }


}
