using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjektCS.Data;

namespace ProjektCS.Models
{
    public class Playlista
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string? NAZIV_PLAYLISTE { get; set; }
        public string? ZANR { get; set; }
        public int? ID_ARANZMANA { get; set; }
    }


}
