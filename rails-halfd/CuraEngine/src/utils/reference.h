class PolygonRef
{
    ClipperLib::Path* polygon;
    PolygonRef()
    : polygon(nullptr)
    {}
public:
    PolygonRef(ClipperLib::Path& polygon)
    : polygon(&polygon)
    {}

    unsigned int size() const;
    Point operator[] (unsigned int index) const;
    void* data()   ;
    void add(const Point p);
    void remove(unsigned int index);
    void clear();
    bool orientation() const;
    void reverse();
    int64_t polygonLength() const;
    double area() const;
    Point centerOfMass() const;
    Point closestPointTo(Point p)    ;
    bool inside(Point p);
    ClipperLib::Path::iterator begin();
    ClipperLib::Path::iterator end();
    ClipperLib::Path::const_iterator begin() const;
    ClipperLib::Path::const_iterator end() const;
    friend class Polygons;
    friend class Polygon;
};

class Polygon : public PolygonRef
{
    ClipperLib::Path poly;
public:
    Polygon()
    : PolygonRef(poly)
   
    Polygon(const PolygonRef& other)
    : PolygonRef(poly);
};

class Polygons
{
private:
    ClipperLib::Paths polygons;
public:
    unsigned int size();
    PolygonRef operator[] (unsigned int index);
    void remove(unsigned int index);
    void clear();
    void add(const PolygonRef& poly);
    void add(const Polygons& other);
    PolygonRef newPoly();
    Polygons() {};
    Polygons(const Polygons& other) { polygons = other.polygons; };
    Polygons& operator=(const Polygons& other) { polygons = other.polygons; return *this; };
    Polygons difference(const Polygons& other) const;
    Polygons unionPolygons(const Polygons& other) const;
    Polygons intersection(const Polygons& other) const;
    Polygons offset(int distance) const;
    vector<Polygons> splitIntoParts(bool unionAll = false) const;

private:
    void _processPolyTreeNode(ClipperLib::PolyNode* node, vector<Polygons>& ret) const;

public:
    Polygons processEvenOdd() const
    int64_t polygonLength() const
    bool inside(Point p)
    void applyMatrix(const PointMatrix& matrix)

};

/* Axis aligned boundary box */
class AABB
{
public:
    Point min, max;

    AABB()
    : min(POINT_MIN, POINT_MIN), max(POINT_MIN, POINT_MIN);
    AABB(Polygons polys)
    : min(POINT_MIN, POINT_MIN), max(POINT_MIN, POINT_MIN);
    void calculate(Polygons polys)
    bool hit(const AABB& other) const

};

}//namespace cura

#endif//UTILS_POLYGON_H
