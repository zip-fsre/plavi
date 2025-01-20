using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class Dogadjaj
{
    public int Id { get; set; }

    public string? Svrha { get; set; }

    public string? Naziv { get; set; }

    public DateOnly? Datum { get; set; }

    public string? Napomena { get; set; }

    public string? Klijent { get; set; }

    public string? KontaktKlijenta { get; set; }

    public string? KontaktSponzora { get; set; }

    public virtual ICollection<Gost> Gosts { get; set; } = new List<Gost>();

    public virtual ICollection<MedjutablicaPt1> MedjutablicaPt1s { get; set; } = new List<MedjutablicaPt1>();
}
