using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjektCS.Data;

namespace ProjektCS.Models
{
    public class Prostor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string? LOKACIJA { get; set; }
        public int? BROJ_STOLOVA { get; set; }
        public int? BROJ_MJESTA_PO_STOLU { get; set; }
        public int? UKUPAN_KAPACITET { get; set; }
        public int? ID_ARANZMANA { get; set; }
    }


}
