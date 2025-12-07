namespace GameDataManager
{
    public class GameItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; } // e.g., Weapon, Armor, Potion
        public int PowerLevel { get; set; }
        public int Price { get; set; }

        public override string ToString()
        {
            return $"{Id}. {Name} | Type: {Type} | Power: {PowerLevel} | Price: {Price}";
        }
    }
}