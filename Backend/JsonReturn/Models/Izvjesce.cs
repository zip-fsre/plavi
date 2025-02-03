using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class Izvjesce
{
    public int Id { get; set; }

    public string? Naziv { get; set; }

    public string? Opis { get; set; }

    public int? OdabraniPartner { get; set; }

    public DateTime? Pocetak { get; set; }

    public DateTime? Kraj { get; set; }

    public virtual ICollection<MedjutablicaPt2> MedjutablicaPt2s { get; set; } = new List<MedjutablicaPt2>();
}
