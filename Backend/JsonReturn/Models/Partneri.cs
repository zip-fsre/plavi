using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class Partneri
{
    public int Id { get; set; }

    public string? Naziv { get; set; }

    public string? Tip { get; set; }

    public string? Napomena { get; set; }

    public double? Provizija { get; set; }

    public virtual ICollection<Aranzman> Aranzmen { get; set; } = new List<Aranzman>();

    public virtual ICollection<MedjutablicaPt1> MedjutablicaPt1s { get; set; } = new List<MedjutablicaPt1>();
}
